const db = require("../../db/connection");

exports.createLookupObj = (arr, key1, key2) => {
  const refObj = {}
  arr.forEach((element) => {
    refObj[element[key1]] = element[key2]
  })
  return refObj
}


exports.convertTimestampToDate = ({ created_at, ...otherProperties }) => {
  if (!created_at) return { ...otherProperties };
  return { created_at: new Date(created_at), ...otherProperties };
};



