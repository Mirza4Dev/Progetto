const { ObjectId } = require('mongodb')
const connection = require('./connection')

async function deleteData(colName, id) {
  let db = await connection()
  const col = db.collection(colName)

  // Delete the document into the specified collection        
  const deleteResult = await col.deleteOne({ _id: new ObjectId(id) })
  console.log('Deleted documents =>', deleteResult)
  return deleteResult
}

module.exports = deleteData
