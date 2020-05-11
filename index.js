const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();


const app = express();
app.use(cors());
app.use(bodyParser.json());
const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



app.get('/foods', (req, res)=>{
    client = new MongoClient(uri, { useNewUrlParser: true});
    client.connect(err => {
        const collection = client.db("redOnion").collection("foods");
        collection.find().toArray((err, document)=>{
            if(err) { 
                console.log(err);
            } else {
              
              res.send(document);
            }
        })
        client.close();
      });
})

app.get('/foods/:id', (req,res)=>{
    const key= Number(req.params.id);

    client = new MongoClient(uri, { useNewUrlParser: true});
    client.connect(err => {
        const collection = client.db("redOnion").collection("foods");
        collection.find({id:key}).toArray((err, document)=>{
            if(err) { 
                console.log(err);
            } else {
              res.send(document[0]);
            }
        })
        client.close();
      });


})


app.post('/addFood', (req, res)=>{

    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  const food= req.body;

  client.connect(err => {
      const collection = client.db("redOnion").collection("foods");
      collection.insert(food, (err, result)=>{
          if(err) { 
              console.log(err);
          } else {
            console.log('Successfully inserted', result);
            res.send(result.ops[0]);
          }
      })
    //   client.close();
    });
  
})


app.post('/placeOrder', (req, res)=>{

client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const orderDetails= req.body;
orderDetails.orderTime= new Date(); 

client.connect(err => {
    const collection = client.db("redOnion").collection("orders");
    collection.insert(orderDetails, (err, result)=>{
        if(err) { 
            console.log(err);
        } else {
          console.log('Successfully ordered', result);
          res.send(result.ops[0]);
        }
    })
  //   client.close();
  });

})
const port= process.env.PORT || 4300
app.listen(port, (err)=>{console.log('Listening to port', port);});