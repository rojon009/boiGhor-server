const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectID = require("mongodb").ObjectID;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xfpad.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 5000;

client.connect((err) => {
  const orderCollection = client.db("boighor").collection("orders");
  const booksCollection = client.db("boighor").collection("books");
  app.get("/", (req, res) => {
    res.send("Getting all collection");
  });

  app.post("/order", (req, res) => {
    orderCollection
      .insertOne(req.body)
      .then((result) => {
        res.send(result.insertedCount > 0);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  app.get("/order/:uid", (req,res) => {
      orderCollection
      .find({userId: req.params.uid})
      .toArray((err, docs) => {
          res.send(docs)
      })
  })

  app.get("/books", (req, res) => {
    booksCollection.find({}).toArray((err, docs) => {
      res.send(docs);
    });
  });

  app.post("/addBook", (req, res) => {
    booksCollection
      .insertOne(req.body)
      .then((result) => {
        res.send(result.insertedCount > 0);
      })
      .catch((err) => {
        res.send(err);
      });
  });

  app.get("/books/:id", (req, res) => {
    booksCollection
      .findOne({
        _id: new ObjectID(req.params.id)
      })
      .then((result) => res.send(result));
  });

  app.delete("/books/:id", (req, res) => {
    booksCollection
      .deleteOne({
        _id: new ObjectID(req.params.id),
      })
      .then((result) => {
        res.send(result.deletedCount > 0);
      });
  });
});

app.listen(port, () => {
  console.log(`This app listening at http://localhost:${port}`);
});
