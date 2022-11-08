const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
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
