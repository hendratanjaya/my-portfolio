![Thinking very seriously here](/how-i-increased-api-performance-pict-1.jpeg)

One of my core memories from when I was working as junior backend engineer at my old company is when I asked to fix performance issue of a dashboard enpoint. The issue is pretty simple, every time this particular client logged in and accessed the dashboard, the dashboard never succesfully display their data, the endpoint timed out. 

My first instinct? "What kind of crime they commited to the query they use for this?"

But I need a justified data to actually build a thesis for this problem. So I documented how the frontend calls this API, I discovered a guide that narrows down the scope of my exploration:

**Frontend only fetched data from the start of the month up to today, which at that time was 21 days.**

Now I know what time range I need to explore to the database. What shocked me is, from those 21 days time range, I only found about 4,800 records of data, which is not small, but shouldn't be particulary difficult for the database to handle. 

Well, let's test the enpoint locally. Let's see how much it really takes to fetch those 4,800 records. One minutes passed.., two minutes passed.. three minutes passed.., "Might as well grab a coffe while I wait", Ten minutes passed by.. Well, at this point the client should just find another vendor instead of wating, haha.

I do the obvious thing here, narrow the time range even more, let's see how a two-day range performs, and you know what I found?

**It took ~50s to fetch 530 records**

Let,s see the code, what kind of crime being written, let's see how much the whole process took time:
**Benchmark from start to end**
| Benchmark Step | Time (ms) |
|---|---|
| pre query setup | 0.001 |
| promise.all db queries | 57,458.883 |
| sum debit transaction loop | 0.001 |
| getAll processing loop | 8.700 |
| await orderDetail promises | 1,109.182 |
| **Total** | **58,576.93** |

| Count | Value |
|---|---|
| Total data | 530 |  

Wow, we can see the culprit here, 57s took to run a ```promise.all```, let's measure each query individually:
| Query | Time (ms) | Count (amount of data) |
|---|---|---|
| aggregate_order | 51,484.483 | 530 |
| account | 38.654 | — |
| template | 38.744 | 3 |
| transaction | 180.043 | 0 |
| **total** | **51,485.226** | — |

*Note: each of this benchmark above done in separate time, thats why they might produce different result due to inconsistent latency in development environment*

Now, it's getting more obvious which process took the most time let's see what kind of pipeline the aggregation run.

**Aggregation Pipeline**
```javascript
const matchStage = [
  {
    $match: searchOrder,
  },
  {
    $lookup: {
      from: "orderstatuses",
      localField: "order_status",
      foreignField: "_id",
      as: "order_status",
    },
  },
  {
    $match: {
      "order_status.deleted_at": null,
    },
  },
];
const dataPipeline = [
  ...matchStage,
  {
    $lookup: {
      from: "customers",
      localField: "customer",
      foreignField: "_id",
      as: "customer",
    },
  },
  {
    $lookup: {
      from: "orderdetails",
      localField: "order_detail",
      foreignField: "_id",
      as: "order_detail",
    },
  },
];
```

Hmm, to be honest, it's not that bad, it's pretty straight forward with not much of a magic, so how come it takes so much time? I also checked the index and everythhing set up just fine with no index miss, so indexing is out of scope here. Until I did this and everything starting to make sense.

**I edited dataPipeline to only returns `_id`**
```javascript
const dataPipeline = [
  ...matchStage,
  {
    $lookup: {
      from: "customers",
      localField: "customer",
      foreignField: "_id",
      as: "customer",
    },
  },
  {
    $lookup: {
      from: "orderdetails",
      localField: "order_detail",
      foreignField: "_id",
      as: "order_detail",
    },
  },
  {
    $project: { // New line, so the pipeline only return the _id of each record
      _id: 1 
    }
  }
];
````
I didn't remove the lookups. I kept the pipeline almost identical and only added a $project stage that returned _id. If the aggregation itself was inherently slow, this shouldn't have made such a dramatic difference.


**The result?**

| Benchmark Step | Time (ms) |
|---|---|
| pre query setup | 0.001 |
| promise.all db queries | 1,447.696 |
| sum debit transaction loop | 0.006 |
| getAll processing loop | 1.865 |
| await orderDetail promises | 0.016 |
| **Total** | **1,449.811** |


| Count | Value |
|---|---|
| Total data | 4,801 |

**Wow**, 4,801 records, thats from the 21 day range, and it only took ~1 second to fetch everything??? Compared to the previos benchmark that took ~50s for only 530 record, this is crazy: 

**Side by side comparison**
| Metric | Before | After | Improvement |
|---|---|---|---|
| aggregate_order time | 51,484.483ms | 441.310ms | 🔻 99.1% faster |
| total data returned | 530 | 530 | — |


**Hahaha, 99% improvement!**

The `_id` experiment changed my direction completely.
The same aggregation pipeline that previously took tens of seconds suddenly handled 4,801 records in around a second when I only returned _id.

At that point, I stopped asking:

"Is the query slow?"

And started asking:

"What the hell am I actually returning?"

The culprit? I checked the data from database, this time I try to find what make this client's data set any different with the other client, and turns out since our company uses MongoDB, this client has a unique field that only can be find within their data set, and those data is not filtered during fetch process. The data structure below roughly the shape of those unique fields that bloat the payload resulting in the endpoint timed out. 
```
Order document
├── customer
├── pricing
├── status
├── ...
└── get_seat_layout // culprit: unffiltered unique field from the client
    ├── payload
    └── output
        ├── Rows
        │   ├── Row A
        │   │   ├── Seat 1
        │   │   ├── Seat 2
        │   │   └── many more seat
        │   ├── Row B
        │   ├── Row C
        │   └── many more row
        └── metadata
```

Knowing the causes of the problem the fix is just pretty much straight forward. I refactored the entire pipeline to only fetches the needed field for the dashboard with a simple ```$project```
```javascript
const dataPipeline = [
  {
  ...oldPipelines, 
  $project: { // filter to only include needed field
      grand_total: 1,
      "status": 1,
      "expiry_date": 1,
      "order_status.status": 1,
    },
  },
];
```

Problem solved! My QA happy, the client happy haha.

## What I Learned

Fetching data you don't need is not free. It never was.

In this case, one unfiltered client-specific field,a full seat layout 
nested several levels deep silently bloating every single order 
document. MongoDB fetched it anyway. Node.js deserialized it anyway. 
The network transferred it anyway. And it did this for every record, 
every request, until the server gave up.

The fix was one pipeline stage. The lesson is much older than MongoDB:

**Only fetch what you actually use.**

Before you blame your indexes, your infrastructure, or your query 
structure you shouold probably check what your query is actually returning. Pop open 
a document. Look at the shape of it. You might be carrying a seat 
map for an entire cinema in every API response and not even know it.

`$project` is not an optimization trick. It's basic hygiene ~
