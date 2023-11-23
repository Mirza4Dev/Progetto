const connection = require('./connection');

async function insertDocument(collectionName, documentData) {
  try {
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

    console.log(`${collectionName.slice(0, -1)} registrato con successo!`);
    return insertResult;
  } catch (error) {
    console.error(`Errore durante la registrazione di ${collectionName.slice(0, -1)}:`, error.message);
    throw error; // Aggiunto per propagare l'errore
  }
}

module.exports = insertDocument;
