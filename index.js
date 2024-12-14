const express = require('express');
const cors = require('cors');
require('dotenv').config()
const app = express();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
console.log(process.env)

// middleWare
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.r9h20.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();
        const database = client.db('CoffeeDB');
        const coffeeCollection = database.collection('coffees');

        // Post a 
        app.post('/coffees', async (req, res) => {
            const body = req.body;
            const result = await coffeeCollection.insertOne(body)
            res.send(result)
        })

        // Update a 
        app.put('/coffees/:id', async(req, res) => {
            const id = req.params.id;
            const body = req.body
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            console.log(body);
            
            const updatedData = {
                $set:{
                    name: body.name,
                    chef: body.chef,
                    supplier: body.supplier,
                    taste: body.taste,
                    category: body.category,
                    details: body.details,
                    photo: body.photo,

                }
            }
            const result = await coffeeCollection.updateOne(filter, updatedData, options)
            res.send(result)
        })

        // delete a
        app.delete('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const quary = { _id: new ObjectId(id) };
            const result = await coffeeCollection.deleteOne(quary);
            res.send(result)
        })

        // get read many
        app.get('/coffees', async (req, res) => {
            const cursor = coffeeCollection.find();
            const result = await cursor.toArray()
            res.send(result)
        })

        // get read a 
        app.get('/coffees/:id', async (req, res) => {
            const id = req.params.id;
            console.log(id);
            const quary = { _id: new ObjectId(id) };
            const result = await coffeeCollection.findOne(quary)
            res.send(result)
        })


        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('alhamdulillah')
})
app.listen(port, () => {
    console.log('port is running');

})