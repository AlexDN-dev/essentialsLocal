const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const exphbs = require("express-handlebars");

const app = express();

const corsOptions = {
  origin: "http://localhost:5173",
};

app.engine(
  "hbs",
  exphbs({
    extname: "hbs", // utilisez l'extension .hbs pour vos fichiers Handlebars
  })
);

app.set("view engine", "hbs");

const PORT = process.env.PORT || 3000;

app.use(cors(corsOptions));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

//ROUTES
const productsRouter = require("./routes/productsRouter");
const farmsRouter = require("./routes/farmsRouter");
const clerkRouter = require("./routes/clerkRouter");
const supportRouter = require("./routes/supportRouter");

app.use("/products", productsRouter);
app.use("/farms", farmsRouter);
app.use("/users", clerkRouter);
app.use("/support", supportRouter);

app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
