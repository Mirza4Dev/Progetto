// se c'è già stata una connessione
//      allora riutilizziamo la connessione
// altrimenti
//   aa  creiamo una nuova connessione e ce la salviamo da parte
const { MongoClient } = require("mongodb");
const url = process.env.CONNECTION_STRING
const client = new MongoClient(url);
const dbName = "gettingStarted";
let isConnected = false

async function connection() {

  try {
    // Connect to the Atlas cluster
    if (!isConnected) {
      await client.connect();
    }

    return client.db(dbName);

  } catch (err) {
    console.log(err.stack);
  }

}

module.exports = connection
