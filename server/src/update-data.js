
const connection = require('./connection')

async function update(colName, query) {
  let db = await connection()
  const col = db.collection(colName);

  // Update the document into the specified collection        
  const updateResult = await col.updateOne(query, { $set: { dead: true } });
  console.log('Updated documents =>', updateResult);
  return updateResult
}

module.exports = update
