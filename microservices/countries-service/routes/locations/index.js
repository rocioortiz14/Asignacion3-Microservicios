// Importamos la biblioteca Express
const express = require("express");

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

router.get("/country/:capital", (req, res) => {
  const countries = Object.keys(data.dataLibrary.countries).filter((key) => {
    return data.dataLibrary.countries[key].capital.toLowerCase() === req.params.capital.toLowerCase();
  }).map((key) => {
    return data.dataLibrary.countries[key];
  });

  const response = {
    service: "countries",
    architecture: "microservices",
    length: countries.length,
    data: countries,
  };

  logger("Get countries data");
  return res.send(response);
});


// Exportamos el router
module.exports = router;
