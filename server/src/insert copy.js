const connection = require('./connection');

async function insertDocument(collectionName, documentData) {
  const db = await connection();
  const collection = db.collection(collectionName);

  // Verifica se il documento esiste già per evitare duplicati
  const existingDocument = await collection.findOne({ email: documentData.email });

  if (existingDocument) {
    // Il documento esiste già, restituisci un valore per indicarlo
    return { error: `${collectionName.slice(0, -1)} già registrato con questa email` };
  }

  // Inserisci il nuovo documento nel database
  const insertResult = await collection.insertOne(documentData);

  return insertResult;

}

module.exports = insertDocument;
