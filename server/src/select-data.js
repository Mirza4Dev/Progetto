const { ObjectId } = require("mongodb");
const connection = require('./connection');

async function selectData(colName, query) {
  // Reference the collection in the specified database
  let db = await connection();
  let col = db.collection(colName);

  // Find and return the document based on the provided query
  const selectResult = query ? await col.findOne(query) : await col.find({}).toArray();
  return selectResult;
}

module.exports = selectData;
