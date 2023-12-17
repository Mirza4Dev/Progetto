const connection = require('./connection');


async function selectData(colName, query) {
  let db = await connection();
  let col = db.collection(colName);

  const selectResult = query ? await col.find(query).toArray() : await col.find({}).toArray();
  return selectResult;
}

module.exports = selectData;


