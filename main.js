const express = require("express");
var bodyParser = require('body-parser')
var cors = require('cors')
var jsonParser = bodyParser.json()

// create application/x-www-form-urlencoded parser
var urlencodedParser = bodyParser.urlencoded({ extended: false })
const { MongoClient, ServerApiVersion } = require('mongodb');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const uri = "mongodb+srv://default_user:user_password@cluster0.3ybrji2.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});
const app = express();
app.use(cors())
app.use(express.static('client/build'));
// let the react app to handle any unknown routes 
// serve up the index.html if express does'nt recognize the route
const path = require('path');
app.get('/', jsonParser, async (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
});

app.post('/make_draft', jsonParser, async (req, res) => {
    try {
        const { author, products } = req.body
        const db = client.db('Cluster0');
        const col = db.collection("Drafts");
        const element = await col.findOne({ author: author })
        if (element) {
            await col.findOneAndReplace({ author: author }, { author: author, products: products })
        } else {
            await col.insertOne({ author: author, products: products })
        }
        res.status(200).json({ message: 'Succesful' })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})

app.post('/get_draft', jsonParser, async (req, res) => {
    try {
        const { author } = req.body
        const db = client.db('Cluster0');
        const col = db.collection("Drafts");
        const element = await col.findOne({ author: author })
        if (!element) {
            res.status(200).json({ products: [] })
            return;
        }
        res.status(200).json({ products: element.products })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})

app.post('/delete_draft', jsonParser, async (req, res) => {
    try {
        const { author } = req.body
        const db = client.db('Cluster0');
        const col = db.collection("Drafts");
        await col.deleteOne({ author: author })
        res.status(200).json({ message: 'Succesful' })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})

app.post('/make_request', jsonParser, async (req, res) => {
    try {
        const { author, products } = req.body
        const db = client.db('Cluster0');
        const col = db.collection("Requests");
        const time = new Date()[Symbol.toPrimitive]('string')
        const data = await col.find().toArray()
        await col.insertOne({ "author": author, "products": products, "time": time, "id": data.length + 1 })
        res.status(200).json({ message: 'Succesful' })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})

app.post('/return_all_requests', jsonParser, async (req, res) => {
    try {
        const db = client.db('Cluster0');
        const col = db.collection("Requests");
        const reqs = await col.find().toArray();
        res.status(200).json({ array: reqs })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})
app.post('/return_all_products', jsonParser, async (req, res) => {
    try {
        const db = client.db('Cluster0');
        const col = db.collection("Products");
        const reqs = await col.find().toArray();
        res.status(200).json({ array: reqs })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})
app.post('/return_request_from_user', jsonParser, async (req, res) => {
    try {
        const db = client.db('Cluster0');
        const col = db.collection("Requests");
        const reqs = await col.find({ author: req.body.author }).toArray();
        res.status(200).json({ array: reqs })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})

app.post('/make_product', jsonParser, async (req, res) => {
    try {
        const { name, group, author } = req.body
        const db = client.db('Cluster0');
        const col = db.collection("Products");
        const time = new Date()[Symbol.toPrimitive]('string')
        const element = await col.findOne({ "name": name })
        if (element) {
            res.status(500).json({ error: 'Unknown error' })
            return;
        }
        await col.insertOne({ "author": author, "name": name, "group": group, "time": time })
        res.status(200).json({ message: 'Succesful' })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})

app.post("/api/register", jsonParser, async (req, res) => {
    try {
        const { login, password } = req.body
        const hashed_password = await bcrypt.hash(password, saltRounds)
        const db = client.db('Cluster0');
        const col = db.collection("Users");
        const element = await col.findOne({ "login": login })
        if (element) {
            res.status(500).json({ error: 'Such an account already exists' })
            return;
        }
        await col.insertOne({ "login": login, "password": hashed_password })
        res.status(200).json({ message: 'Succesfull' })
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
});
app.post("/api/login", jsonParser, async (req, res) => {
    try {
        const { login, password } = req.body
        const db = client.db('Cluster0');
        const col = db.collection("Users");
        const element = await col.findOne({ "login": login })
        if (!element) {
            res.status(500).json({ error: 'There is no such account' })
            return;
        }
        if (await bcrypt.compare(password, element.password)) {
            res.status(200).json({ message: 'Succesfull' })
        } else {
            res.status(500).json({ error: 'Incorrect password' })
        }
    } catch (e) {
        res.status(500).json({ error: `${e.name}: ${e.message}` })
    }
})
async function run() {
    await client.connect();
    app.listen(5000);
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
}
run().catch(console.dir);
