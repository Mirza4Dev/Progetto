const connection = require('./connection')
const { ObjectId } = require('mongodb')

async function updateData(colName, id, updatedData) {
  const db = await connection()
  const col = db.collection(colName)
  const updateResult = await col.updateOne(
    { _id: new ObjectId(id) },
    { $set: updatedData }
  )

  console.log('Updated documents =>', updateResult)
  return updateResult

}


module.exports = updateData










// const connection = require('./connection')

// async function updateData(colName, query, input) {
//   let db = await connection()
//   const col = db.collection(colName)

//   // Update the document into the specified collection        
//   const updateResult = await col.updateOne(query, input)
//   console.log('Updated documents =>', updateResult)
//   return updateResult
// }

// module.exports = updateData




