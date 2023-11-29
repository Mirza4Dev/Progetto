const { ObjectId } = require("mongodb");
const connection = require('./connection');

// Modifica il tuo modulo selectData

async function selectData(colName, query) {
  let db = await connection();
  let col = db.collection(colName);

  const selectResult = query ? await col.find(query).toArray() : await col.find({}).toArray();
  return selectResult;
}

module.exports = selectData;


