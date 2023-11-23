
const connection = require('./connection')

async function delData(colName, query) {
  let db = await connection()
  const col = db.collection(colName);

  // Delete the document into the specified collection        
  const deleteResult = await col.deleteMany(query);
  console.log('Deleted documents =>', deleteResult);
  return deleteResult
}


module.exports = delData