const connection = require('./connection')

async function insertDocument(colName, input) {
  let db = await connection()
  const col = db.collection(colName)

  // Insert the document into the specified collection        
  const doc = await col.insertOne(input)
  return doc
}

module.exports = insertDocument