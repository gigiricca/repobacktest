const express = require("express");
const sequelize = require("./config/database");
const routes = require("./routes");
const cors = require('cors');
const app = express();

app.use(express.json());

// Configurar CORS de forma específica
app.use(cors({
    origin: ['https://www.cateringlink.store', 'https://cateringlink.store'], // Dominios permitidos
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
    allowedHeaders: '*',  // Permitir todos los encabezados
    credentials: true  // Permitir envío de cookies/credenciales
}));

app.use("/api", routes);

const PORT = process.env.PORT || 8080;
const HOST = '0.0.0.0';  // Permitir acceso desde cualquier red

// Sincronizar modelos y luego iniciar el servidor
sequelize.
  sync()  // No usar { alter: true } en producción
  .then(() => {
    app.listen(PORT, HOST, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });

// Definir una ruta para manejar solicitudes a "/"
app.get('/', (req, res) => {
  res.send('Bienvenido a la API'); 
});
