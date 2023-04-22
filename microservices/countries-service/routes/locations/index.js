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


  router.get("/country/:capital", async (req, res) => {
    try {
      const capital = req.params.capital.toLowerCase();
      const countries = Object.keys(data.dataLibrary.countries).filter((key) => {
        return data.dataLibrary.countries[key].capital.toLowerCase() === capital;
      }).map((key) => {
        return data.dataLibrary.countries[key];
      });
  
      if (countries.length === 0) {
        res.status(404).json({ message: "Capital not found" });
      } else {
        const countryName = countries[0].name;
        
        // Get authors from the country
        const authorsResponse = await fetch(`http://authors:3000/api/v2/authors/country/${countryName}`);
        const authors = await authorsResponse.json();
        
        // Get books from the country
        const booksResponse = await fetch(`http://books:4000/api/v2/books/country/${countryName}`);
        const books = await booksResponse.json();
        
        // Create the response object
        const responseObj = {
          service: "countries",
          architecture: "microservices",
          country: countryName,
          authors: authors,
          books: books
        };
        
        res.status(200).json(responseObj);
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    }
  });
  
  
// Exportamos el router
module.exports = router;
