const { ObjectId } = require("mongodb");
const connection = require('./connection')

async function selectData(colName, id) {
  // Reference the "people" collection in the specified database
  let db = await connection()
  let col = db.collection(colName);

  // Find and return the document
  const selectResult = id ? await col.findOne({ "_id": new ObjectId(id) }) :
    await col.find({}).toArray()
  return selectResult
}

module.exports = selectData