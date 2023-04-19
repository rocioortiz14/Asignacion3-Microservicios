const express = require("express"); // importa Express
const fetch = require("node-fetch");
const router = express.Router(); // crea un nuevo enrutador de Express
const data = require("../../data/data-library"); // importa los datos de data-library
const logger = (message) => console.log(`Author Services: ${message}`);

// define un controlador para la ruta raíz ("/")
router.get("/", (req, res) => {
  const response = {// crea una respuesta con información sobre los libros
    service: "books",
    architecture: "microservices",
    length: data.dataLibrary.books.length,
    data: data.dataLibrary.books,
  };
  logger("Get book data"); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

// define un controlador para la ruta "/title/:title"
router.get("/title/:title", (req, res) => {
  // busca los libros que contengan el título buscado
  const titles = data.dataLibrary.books.filter((title) => {
    return title.title.includes(req.params.title);
  });
  // crea una respuesta con información sobre los libros que coinciden con el título buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: titles.length,
    data: titles,
  };
  return res.send(response); // devuelve la respuesta al cliente
});

//Buscar libro por nombre de autor//
router.get("/author/:author", async (req, res) => {
  const author = req.params.author;
  try {
    const response = await fetch(`http://authors:3000/api/v2/authors/author/${author}`);
    const authors = await response.json();
    const bookAuthors = data.dataLibrary.books.filter((book) => book.authorid === authors.data[0].id);
    const responseData = {
      service: "books",
      architecture: "microservices",
      length: bookAuthors.length,
      data: bookAuthors,
    };
    return res.send(responseData);
  } catch (error) {
    console.log(error);
    return res.status(500).send("Error fetching authors data");
  }
});
//filtrar por rango de año 1900-1930
router.get("/Year/:startYear/:endYear", (req, res) => {
  const startYear = parseInt(req.params.startYear); // obtiene el parámetro "startYear"
  const endYear = parseInt(req.params.endYear); // obtiene el parámetro "endYear"
  const books = data.dataLibrary.books.filter((book) => {
    const year = parseInt(book.year);
    return year >= startYear && year <= endYear; // filtra los libros según el rango de años
  });
  const response = { // crea una respuesta con información sobre los libros filtrados
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books.map((book) => ({ title: book.title, year: book.year })),
  };
  logger(`Get book data filtered by year (startYear: ${startYear}, endYear: ${endYear})`); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

//>= a 1900
router.get("/Mayor/:Year", (req, res) => {
  const Year = parseInt(req.params.Year); // obtiene el parámetro "Year"

  const books = data.dataLibrary.books.filter((book) => {
    const year = parseInt(book.year);
    return year >= Year ; // filtra los libros según el rango de años
  });
  const response = { // crea una respuesta con información sobre los libros filtrados
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books.map((book) => ({ title: book.title, year: book.year })),
  };
  logger(`Get book data filtered by year (añoMayora: ${Year})`); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

//<= a 1900
router.get("/menor/:year", (req, res) => {
  const year = parseInt(req.params.year); // obtiene el parámetro "Year"

  const books = data.dataLibrary.books.filter((book) => {
    const years = parseInt(book.year);
    return years < year // filtra los libros con año menor a 1900
  });
  const response = { // crea una respuesta con información sobre los libros filtrados
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books.map((book) => ({ title: book.title, year: book.year })),
  };
  logger(`Get book data filtered by year (añoMenora: ${year})`); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});


//= a 1900
router.get("/igual/:year", (req, res) => {
  const year = parseInt(req.params.year); // obtiene el parámetro "Year"

  const books = data.dataLibrary.books.filter((book) => {
    const years = parseInt(book.year);
    return years === year // filtra los libros con año menor a 1900
  });
  const response = { // crea una respuesta con información sobre los libros filtrados
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books.map((book) => ({ title: book.title, year: book.year })),
  };
  logger(`Get book data filtered by year (añoIguala: ${year})`); // registra un mensaje en los registros
  return res.send(response); // devuelve la respuesta al cliente
});

/*router.get("/country/:country", (req, res) => {
  // busca los libros que se distribuyen en el país buscado
  const books = data.dataLibrary.books.filter((book) => {
    return book.distributedCountries.includes(req.params.country);
  });
  // crea una respuesta con información sobre los libros que se distribuyen en el país buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books.map((book) => ({ title: book.title, country: book.distributedCountries })),
  };
  return res.send(response); // devuelve la respuesta al cliente
});*/

router.get("/country/:country", async (req, res) => {
  try {
    // busca los libros que se distribuyen en el país buscado
    const books = data.dataLibrary.books.filter((book) => {
      return book.distributedCountries.includes(req.params.country);
    });

    // busca los autores de los libros encontrados
    const authorIds = books.map((book) => book.authorId);
    const authors = data.dataLibrary.authors.filter((author) => authorIds.includes(author.id));

    // crea una respuesta con información sobre los autores y los libros que se distribuyen en el país buscado
    const response = {
      service: "authors_books",
      architecture: "microservices",
      length: authors.length,
      data: authors.map((author) => ({
        name: author.name,
        country: author.country,
        books: books
          .filter((book) => book.authorId === author.id)
          .map((book) => ({ title: book.title, country: book.distributedCountries })),
      })),
    };

    // devuelve la respuesta al cliente
    return res.send(response);
  } catch (error) {
    console.error(error);
    return res.status(500).send("Error interno del servidor");
  }
});


module.exports = router; // exporta el enrutador de Express para su uso en otras partes de la aplicación

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/
