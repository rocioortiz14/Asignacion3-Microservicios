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


/*router.get("/Year/:startYear/:endYear", (req, res) => {
  const startYear = parseInt(req.params.startYear);
  const endYear = parseInt(req.params.endYear);

  // Validar que los años estén en el rango 1900-1930
  if (isNaN(startYear) || isNaN(endYear) || startYear < 1900 || endYear > 1930 || startYear > endYear) {
    return res.status(400).send("Los años deben estar en el rango 1900-1930 y el año de inicio no puede ser mayor que el año final.");
  }

  const books = data.dataLibrary.books.filter((book) => {
    const year = parseInt(book.year);
    return year >= startYear && year <= endYear;
  });

  const response = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books.map((book) => ({ title: book.title, year: book.year })),
  };

  logger(`Get book data filtered by year (startYear: ${startYear}, endYear: ${endYear})`);
  return res.send(response);
});*/


router.get("/Year/:startYear/:endYear", (req, res) => {
  const startYear = parseInt(req.params.startYear);
  const endYear = parseInt(req.params.endYear);

  // Validar que los años estén en el rango 1900-1930
  if (isNaN(startYear) || isNaN(endYear) || startYear < 1900 || endYear > 1930 || startYear > endYear) {
    return res.status(400).send("Los años deben estar en el rango 1900-1930 y el año de inicio no puede ser mayor que el año final.");
  }

  // Validar que los años sean mayores o iguales a 1900
  if (startYear < 1900 || endYear < 1900) {
    return res.status(400).send("Los años deben ser iguales o mayores a 1900.");
  }

  const books = data.dataLibrary.books.filter((book) => {
    const year = parseInt(book.year);

    // Validar año igual a 1900
    if (startYear === 1900 && endYear === 1900) {
      return year === 1900;
    }

    return year >= startYear && year <= endYear;
  });

  const response = {
    service: "books",
    architecture: "microservices",
    length: books.length,
    data: books.map((book) => ({ title: book.title, year: book.year })),
  };

  logger(`Get book data filtered by year (startYear: ${startYear}, endYear: ${endYear})`);
  return res.send(response);
});



 // busca los libros que se distribuyen en el país buscado
router.get("/country/:countries", (req, res) => {
  // Separamos los países seleccionados en una matriz
  const selectedCountries = req.params.countries.split(",");
  // Filtramos los libros por país
  const filteredBooks = data.dataLibrary.books.filter(book => {
    return selectedCountries.some(country => book.distributedCountries.includes(country));
  });


  // crea una respuesta con información sobre los libros que se distribuyen en el país buscado
  const response = {
    service: "books",
    architecture: "microservices",
    length: filteredBooks.length,
    data: filteredBooks.map((book) => ({ title: book.title, country: book.distributedCountries })),
  };
  return res.send(response); // devuelve la respuesta al cliente
});


module.exports = router; // exporta el enrutador de Express para su uso en otras partes de la aplicación

/*
Este código es un ejemplo de cómo crear una API de servicios utilizando Express y un enrutador. El enrutador define dos rutas: una para obtener todos los libros y otra para obtener libros por título. También utiliza una función simple de registro para registrar mensajes en los registros.
*/
