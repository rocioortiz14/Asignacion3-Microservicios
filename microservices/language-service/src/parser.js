
const csv = require('csv-parser');
const fs = require('fs');

const csvFilePath = './data/language-codes.csv';
const jsonArray = [];

fs.createReadStream(csvFilePath)
  .pipe(csv({ headers: ['code', 'name'] })) // Reemplaza los valores de 'col1', 'col2'
  .on('data', (data) => jsonArray.push(data))
  .on('end', () => {
  });