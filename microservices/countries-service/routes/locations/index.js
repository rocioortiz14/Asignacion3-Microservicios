// Importamos la biblioteca Express
const express = require("express");
const fetch = require("node-fetch");
// Importamos el archivo data-library.js que contiene la información sobre los países.
const data = require("../../data/data-library");
// Creamos un router de Express
const router = express.Router();

// Creamos una función de registro que imprime mensajes de registro en la consola
const logger = (message) => console.log(`Countries Service: ${message}`);

// Creamos una ruta GET en la raíz del router que devuelve todos los países
router.get("/", (req, res) => {
  // Creamos un objeto de respuesta con información sobre el servicio y los datos de los países
  const response = {
    service: "countries",
    architecture: "microservices",
    length: data.dataLibrary.countries.length,
    data: data.dataLibrary.countries,
  };
  // Registramos un mensaje en la consola
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});

// Creamos una ruta para obtener países por su capital
router.get("/country/:capital", (req, res) => {
   // Filtramos los países por su capital
  const countries = Object.keys(data.dataLibrary.countries).filter((key) => {
    return data.dataLibrary.countries[key].capital.toLowerCase() === req.params.capital.toLowerCase();
  }).map((key) => {
    return data.dataLibrary.countries[key];
  });

   // Creamos una respuesta con los datos de los países filtrados
  const response = {
    service: "countries",
    architecture: "microservices",
    length: countries.length,
    data: countries,
  };
 // Creamos una respuesta con los datos de los países filtrados
  logger("Get countries data");
  // Enviamos la respuesta al cliente
  return res.send(response);
});
// Creamos una ruta para obtener autores por su capital
router.get("/authors/:country", async (req, res) => {
  //obtenemos informacion soibre los paises y filtramos aquellos cuya capital coincide
  try {
    const countries = Object.keys(data.dataLibrary.countries).filter((key) => {
      return data.dataLibrary.countries[key].capital.toLowerCase() === req.params.country.toLowerCase();
    }).map((key) => {
      return data.dataLibrary.countries[key];
    });
    // Creamos una respuesta con los datos filtrados
    const response = await fetch(`http://authors:3000/api/v2/authors/country/${countries[0].name}`);
    const authors = await response.json();
      const responseObj = {
      service: "countries_authors",
      architecture: "microservices",
      authors
    };
    //respuesta al saervidor
    res.status(200).json(responseObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//obtener los libros de un país 
router.get("/books/:country", async (req, res) => {
  //primero, se filtran las claves de los países que tienen la capital que coincide con el parámetro
  try {
    const countries = Object.keys(data.dataLibrary.countries).filter((key) => {
      return data.dataLibrary.countries[key].capital.toLowerCase() === req.params.country.toLowerCase();
    }).map((key) => {
      return data.dataLibrary.countries[key];
    });
    //petición al microservicio de books
    const response = await fetch(`http://books:4000/api/v2/books/country/${countries[0].name}`);
    const books = await response.json();
    //crea un objeto de respuesta 
      const responseObj = {
      service: "countries_books",
      architecture: "microservices",
      books
      
    };
    res.status(200).json(responseObj);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
});

//obtener una lista de países que hablan un determinado idioma
router.get("/country/language/:codeCountry", (req, res) => {
  const codeCountry = req.params.codeCountry;
  //recupera los datos de países del objeto
  const countries = Object.values(data.dataLibrary.countries).filter(country => country.languages.includes(codeCountry));
  const response = {
  countries
  }
  //devuelve una respuesta JSON
  return res.json(response);
  })
// Exportamos el router
module.exports = router;
