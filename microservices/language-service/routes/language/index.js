// Importamos el paquete express
const express = require("express");

// Creamos un objeto Router
const router = express.Router();

const csv = require('csv-parser');

const fs = require('fs');

// Importamos el módulo data-Library que contiene los datos de los lenguajes
const data = require("../../src/parser.js"); // Lee el archivo JSON generado




// Creamos una función logger que muestra un mensaje en consola
const logger = (message) => console.log(`Language Service: ${message}`);


// Creamos la ruta para obtener todos los lenguajes

router.get('/', (req, res) => {
  const jsonArray = [];

  fs.createReadStream('./data/language-codes.csv')
  .pipe(csv({ headers: ['code', 'name'] })) // Reemplaza los valores de 'col1', 'col2', 'col3', 'col4' con los nombres reales de las columnas en tu archivo CSV
  .on('data', (data) => jsonArray.push(data))
  .on('end', () => {
      // Creamos un objeto de respuesta con los datos del array de objetos JSON
      const response = {
        service: "language",
        architecture: "microservices",
        data: jsonArray,
      };

      // Enviamos la respuesta
      return res.send(response);
    });
});



router.get('/language/:languageCode', async (req, res) => {
  const jsonArray = [];
  
  // Lee el archivo CSV y lo convierte a un array de objetos JSON
  fs.createReadStream('./data/language-codes.csv')
  .pipe(csv({ headers: ['code', 'name'] })) // 
  .on('data', (data) => jsonArray.push(data))
  .on('end',  async()=> {
      // Busca los países que hablan el lenguaje especificado
  const resultadoPaises = await fetch(`http://countries:5000/api/v2/countries/country/language/${req.params.languageCode}`);
  const paises = await resultadoPaises.json();
  const nameArray = paises.countries.map(obj => obj.name);

  // Obtiene los autores que nacieron en los países encontrados
  const resultadoAutores = await fetch(`http://authors:3000/api/v2/authors/country/${nameArray.join(',')}`);
  const autores = await resultadoAutores.json();

  // Obtiene los libros que se originaron en los países encontrados
  const resultadoBooks = await fetch(`http://books:4000/api/v2/books/country/${nameArray.join(',')}`);
  const libros = await resultadoBooks.json();

  // Crea un objeto de respuesta con los datos de los autores y libros
  const response = {
    service: "language",
    architecture: "microservices",
    data: {
      authors: autores,
      books: libros
    }
  };

  // Envía la respuesta
  return res.send(response);
});
});

// Exportamos el objeto Router
module.exports = router;

