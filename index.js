const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const morgan = require("morgan");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.e0fsll4.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function run() {
  try {
    const database = client.db("Tour");
    const CountryCollection = database.collection("Country");
    const spotCollection = database.collection("spot");
    const cartCollection = database.collection("cart");

    // Get all memories
    app.get("/Country", async (req, res) => {
      const result = await CountryCollection.find().toArray();
      res.send(result);
    });
    // Get all
    app.get("/Spot/:Cname", async (req, res) => {
      const Name = req.params.Cname;
      const query = {   country: Name };
      const cursor = spotCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });
    // Save a memory
    app.post("/addSpot", async (req, res) => {
      const spot = req.body;
      console.log(spot);
      const result = await spotCollection.insertOne(spot);
      res.send(result);
    });
    // Get all
    app.get("/spot", async (req, res) => {
      const email = req.query.email;
      const query = { adderEmail: email };
      const result = await spotCollection.find(query).toArray();
      res.send(result);
    });
    
    app.get("/spotA", async (req, res) => {
      try{
        const cursor = spotCollection.find();
        const result = await cursor.toArray();
        res.send(result);
      } catch(err) {
        console.log(err.message);
      }
    });
    // Get a
    app.get("/spotS/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await spotCollection.findOne(query);
        res.send(result);
      } catch (err) {
        console.log(err.message);
      }
    });
    // Get a
    app.get("/update/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await spotCollection.findOne(query);
        res.send(result);
      } catch (err) {
        console.log(err.message);
      }
    });
    
    // Delete-----Done
    app.delete("/deleteS/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await spotCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
    app.patch("/updateS/:id", async (req, res) => {
      try {
        const id = req.params.id;
        console.log("i",id);
        const query = { _id: new ObjectId(id) };
        const updateData = req.body;
        const updateDoc = {
          $set: {
            SpotName: updateData.SpotName,
            SpotImage: updateData.SpotImage,
            averageCost: updateData.averageCost,
            travelTime: updateData.travelTime,
            Location: updateData.Location,
            totaVisitorsPerYear: updateData.totaVisitorsPerYear,
            seasonality: updateData.seasonality,
            country: updateData.country,
           shortDescription: updateData.shortDescription,
          },
        };

        const result = await spotCollection.updateOne(query, updateDoc);
        console.log(result);
        res.send(result);
      } catch (err) {
        console.log("e",err.message); 
      }
    });
 // Save a memory
 app.post("/addCart", async (req, res) => {
  const cart = req.body;
  const result = await cartCollection.insertOne(cart);
  res.send(result);
});
   // Get Cart Bookigs for a specific user who is currently logged in
   app.get("/cart", async (req, res) => {
    const email = req.query.email;
    const query = { cartAdderEmail: email };
    const result = await cartCollection.find(query).toArray();
    res.send(result);
  });
    // Delete from cart-----Done
    app.delete("/deleteC/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartCollection.deleteOne(query);
      console.log(result);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
  }
}
run().catch(console.dir);

app.get("/", (req, res) => res.send(`Welcome to memoryBook server`));
app.listen(port, () => console.log(`Server running at port: ${port}`));
