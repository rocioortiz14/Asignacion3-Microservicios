
const csv = require('csv-parser');
const fs = require('fs');

const csvFilePath = './data/language-codes.csv';
const jsonArray = [];

fs.createReadStream(csvFilePath)
  .pipe(csv())
  .on('data', (data) => jsonArray.push(data))
  .on('end', () => {
    return jsonArray;
  });
