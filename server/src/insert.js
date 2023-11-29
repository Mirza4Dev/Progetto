const connection = require('./connection')

async function insertDocument(colName, input) {
  let db = await connection()
  const col = db.collection(colName);

  // Insert the document into the specified collection        
  const p = await col.insertOne(input);
  console.log(p)
  return p
}

module.exports = insertDocument