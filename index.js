const express = require('express');
const cors = require('cors');
require('dotenv').config()
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


// DB_USER=brandShopMaster
// DB_PASS=19EJRImILgZEYXGH

// node_modules
// .env

// brandShopMaster
// 19EJRImILgZEYXGH



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7dcoggr.mongodb.net/?retryWrites=true&w=majority`;

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

        const brandShopCollections = client.db('brandShopDB').collection('brandShop');
        const brandShopUsersAddToCard = client.db('brandShopBD').collection('UsersAddToCard');

        app.get('/products', async (req, res) => {
            const cursor = brandShopCollections.find();
            const result = await cursor.toArray();
            res.send(result);
        })

        app.get('/products/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await brandShopCollections.findOne(query);
            res.send(result);
        })

        app.get('/addToCard', async (req, res) => {
            const  cursor = brandShopUsersAddToCard.find();
            const result = await cursor.toArray()
            res.send(result);
           
        })

        app.put('/products/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const updateProduct = req.body;
            console.log(updateProduct);
            const product = {
                $set: {
                    name: updateProduct.name,
                    brand: updateProduct.brand,
                    type: updateProduct.type,
                    price: updateProduct.price,
                    description: updateProduct.description,
                    rating: updateProduct.rating,
                    image: updateProduct.image
                }
            };
            const result = await brandShopCollections.updateOne(filter, product, options);
            res.send(result)
        })

        app.post('/products', async (req, res) => {
            const newProduct = req.body;
            console.log(newProduct);
            const result = await brandShopCollections.insertOne(newProduct);
            res.send(result)
        })

        app.post('/addToCard', async (req, res) => {
            const addToCard = req.body;
            const result = await brandShopUsersAddToCard.insertOne(addToCard);
            res.send(result);
        })

        app.delete('/addToCard/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const result = await brandShopUsersAddToCard.deleteOne(query);
            res.send(result);
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
    res.send('Brand Shop Server is running')
});

app.listen(port, () => {
    console.log(`Brand Shop Server is running on port: ${port}`);
})