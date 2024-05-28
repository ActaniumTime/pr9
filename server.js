const express = require('express');
const { MongoClient, ObjectID } = require('mongodb');

const app = express();
const port = 3000;

const uri = "mongodb+srv://mashkov:mashkov@cluster0.6znnou0.mongodb.net/";

async function connectToMongoDB() {
    const client = new MongoClient(uri);
    await client.connect();
    return client;
}

async function listDatabases(client) {
    try {
        const databasesList = await client.db().admin().listDatabases();
        console.log("Databases:");
        databasesList.databases.forEach(db => console.log(` - ${db.name}`));
        return databasesList;
    } catch (error) {
        console.error(error);
    }
}

app.get('/', async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const databasesList = await listDatabases(client);
        res.send(databasesList);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/artists', async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db();
        const artists = await db.collection('artists').find().toArray();
        res.send(artists);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.get('/artists/:id', async (req, res) => {
    try {
        const client = await connectToMongoDB();
        const db = client.db();
        const artist = await db.collection('artists').findOne({ _id: ObjectID(req.params.id) });
        if (!artist) {
            return res.sendStatus(404);
        }
        res.send(artist);
    } catch (error) {
        console.error(error);
        res.sendStatus(500);
    }
});

app.post('/artists', function (req, res) {
    var artist = {
      name: req.body.name
    };
  
  
    db.collection('artists').insert(artist, (err, result) => {
      if (err) {
        console.log(err);
        return res.sendStatus(500);
      }
      res.send(artist);
    })
  })
  
  app.put('/artists/:id', function (req, res) {
    db.collection('artists').updateOne(
      { _id: ObjectID(req.params.id) },
      { name: req.body.name },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
        res.sendStatus(200);
      })
  })
  app.delete('/artists/:id', function (req, res) {
    db.collection('artists').deleteOne(
      { _id: ObjectID(req.params.id) },
      function (err, result) {
        if (err) {
          console.log(err);
          return res.sendStatus(500);
        }
      res.sendStatus(200);
    })
  })
    
app.listen(port, () => {
    console.log(`Server is listening at http://localhost:${port}`);
});
