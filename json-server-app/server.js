const jsonServer = require('json-server');
const axios = require('axios');
const server = jsonServer.create();
const router = jsonServer.router({});  // Creamos el router vacío
const middlewares = jsonServer.defaults();

server.use(middlewares);
server.use(jsonServer.bodyParser);

// Cargar datos desde GitHub
axios.get('https://trophicbus89.github.io/dataRegistraApp/jsonServer/data.json')
  .then(response => {
    // Cargamos los datos directamente en el router como base de datos
    router.db = response.data;  // Asignamos directamente los datos a router.db
    server.use(router);
  })
  .catch(error => {
    console.error('Error al cargar el archivo JSON desde GitHub:', error);
  });

// Levantar el servidor
server.listen(3001, () => {
  console.log('JSON Server corriendo en http://localhost:3001');
});
