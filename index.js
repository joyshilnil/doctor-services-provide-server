const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.nszcfsh.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    const serviceCollection = client.db("doctor").collection("services");
    const reviewCollection = client.db("doctor").collection("reviews");

    app.get("/limitservices", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.limit(3).toArray();
      res.send(services);
    });

    app.get("/services", async (req, res) => {
      const query = {};
      const cursor = serviceCollection.find(query);
      const services = await cursor.toArray();
      res.send(services);
    });

    app.get("/services/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const service = await serviceCollection.findOne(query);
      res.send(service);
    });

    app.post("/services", async (req, res) => {
      const service = req.body;
      const result = await serviceCollection.insertOne(service);
      res.send(result);
    });

    app.post("/services/:id", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    // Review

    app.get("/reviews", async (req, res) => {
      let query = {};
      if (req.query.email) {
        query = {
          email: req.query.email,
        };
      }
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.get("/review", async (req, res) => {
      let query = {};
      if (req.query.serviceId) {
        query = {
          service: req.query.serviceId,
        };
      }
      console.log(query);
      const cursor = reviewCollection.find(query);
      const reviews = await cursor.toArray();
      res.send(reviews);
    });

    app.delete("/reviews/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await reviewCollection.deleteOne(query);
      res.send(result);
    });

    app.post("/reviews", async (req, res) => {
      const review = req.body;
      const result = await reviewCollection.insertOne(review);
      res.send(result);
    });

    app.get("/reviews/:id", async (req, res) => {
      try {
        const { id } = req.params;

        const review = await reviewCollection.findOne({ _id: ObjectId(id) });

        res.send({
          success: true,
          data: review,
        });
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });

    app.patch("/reviews/:id", async (req, res) => {
      const { id } = req.params;

      try {
        const result = await reviewCollection.updateOne(
          { _id: ObjectId(id) },
          { $set: req.body }
        );

        if (result.matchedCount) {
          res.send({
            success: true,
            message: `successfully updated ${req.body.message}`,
          });
        } else {
          res.send({
            success: false,
            error: "Couldn't update  the product",
          });
        }
      } catch (error) {
        res.send({
          success: false,
          error: error.message,
        });
      }
    });
  } finally {
  }
}
run().catch((error) => console.error(error));

app.get("/", (req, res) => {
  res.json({
    message: "its works",
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("Server is runnigg" + process.env.PORT);
});
