const express = require("express");
const sequelize = require("./config/database");
const routes = require("./routes");

const app = express();
app.use(express.json());

app.use("/api", routes);

const PORT = process.env.PORT || 3000;

// Sincronizar modelos y luego iniciar el servidor
sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en el puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Error al sincronizar la base de datos:", err);
  });
