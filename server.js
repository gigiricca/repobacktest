const express = require("express");
const sequelize = require("./config/database");
const routes = require("./routes");
const cors = require('cors');
const app = express();

app.use(express.json());

// Configurar CORS de forma específica
app.use(cors({
    origin: ['https://www.cateringlink.store', 'https://cateringlink.store'], // Cambia esto al dominio de tu frontend en Vercel
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Métodos HTTP permitidos
    allowedHeaders: ['Content-Type', 'Authorization'],  // Encabezados permitidos
    credentials: true  // Permitir envío de cookies/credenciales
}));

app.options('*', cors());

app.use("/api", routes);

const PORT = process.env.PORT || 8080;
const HOST = '127.0.0.1';  // Cambia esto de '::' o '0.0.0.0' a '127.0.0.1'

// Sincronizar modelos y luego iniciar el servidor
sequelize.
  sync({ alter: true })
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
