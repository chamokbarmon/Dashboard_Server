const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

const Port = 5000;
app.get("/", (req, res) => {
  res.send("server is good");
});

app.listen(Port, () => {
  console.log("Server is running ", { Port });
});

const { MongoClient, ObjectId } = require("mongodb");

const uri =
  `mongodb+srv://${process.env.REACT_USERNAME}:${process.env.REACT_DBPASSWORD}@cluster0.ojfpjwh.mongodb.net/?retryWrites=true&w=majority`

const client = new MongoClient(uri);

const productCollection = client.db("DashboardDb").collection("ProductsDb");

// const client = new MongoClient(uri, {
//     serverApi: {
//       version: ServerApiVersion.v1,
//       strict: true,
//       deprecationErrors: true,
//     }
//   });

async function run() {
  try {
    await client.connect();
  } catch (error) {
    console.log(error.name, error.message);
  }
}

run();

app.post("/product", async (req, res) => {
  console.log(req.body);
  try {
    const result = await productCollection.insertOne(req.body);

    if (result.insertedId) {
      res.send({
        success: true,
        message: `successfully created the ${req.body.name} post is created and your id ${result.insertedId} `,
      });
    } else {
      res.send({
        success: false,
        error: "couldn't create the post",
      });
    }
  } catch (error) {
    console.log(error.name, error.message);
    res.send({
      success: false,
      error: error.message,
    });
  }
});

app.get("/product", async (req, res) => {
  try {
    const cursor = productCollection.find({});
    const result = await cursor.toArray();
    res.send(result);
  } catch (error) {
    console.log(error.message);
  }
});
app.get("/productDetails/:id", async (req, res) => {
  const id = req.params.id;
  // query data
  const query = { _id: new ObjectId(id) };
  try { 
    const result = await productCollection.findOne(query);
    res.status(200).send(result);
    console.log(result)
  } catch (error) {
    console.log(error.message);
  }
});
