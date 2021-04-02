const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectId;
const app = express();
const cors = require('cors');
require('dotenv').config();

const port = process.env.PORT || 5005;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hgdqb.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const shopCollection = client.db("fastestShop").collection("products");
  const orderCollection = client.db("fastestShop").collection("orders");


    app.get('/products', (req, res) => {
      shopCollection.find()
      .toArray((err, products) => {
        res.send(products);
      })
    })

    app.post('/addProduct', (req, res) => {
        const newProduct = req.body;
        shopCollection.insertOne(newProduct)
        .then( result => {
            res.send(result.insertedCount > 0)
        })
    })

    app.post('/addOrder', (req, res) => {
      const newOrder = req.body;
      orderCollection.insertOne(newOrder)
      .then(result => {
        res.send(result.insertedCount > 0)
      })
    })

    app.get('/checkOut/:id', (req, res) => {
      const id = ObjectId(req.params.id);
      shopCollection.find({_id: id})
      .toArray((err, checkProduct) => {
        res.send(checkProduct);
      })
    })

    app.get('/orders', (req, res) => {
      const userEmail = req.query.email;
      orderCollection.find({email: userEmail})
      .toArray( (err, products) => {
        res.send(products);       
      })
    })

    app.delete('/deleteProduct/:id', (req, res) => {
      const id = ObjectId(req.params.id);
      shopCollection.findOneAndDelete({_id: id})
      .then(result => {
        res.send(!!result.value)
      })
    })

//   client.close();
});


app.listen(port)