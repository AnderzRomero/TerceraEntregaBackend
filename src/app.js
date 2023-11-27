import express from "express";
import handlebars from "express-handlebars";
import cookieParser from "cookie-parser";
import "./dao/mongo/dbConfig.js";


import viewsRouter from "./routes/views.router.js";
import sessionRouter from "./routes/sessions.router.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

// import cartSetter from "./middlewares/cartSetter.js";

import initializeStrategies from "./config/passport.config.js";
import __dirname from "./utils.js";

const app = express();
const PORT = process.env.PORT || 8080;

// middlewars
// app.use(cartSetter);
app.use(express.urlencoded({ extended: true }));

app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(cookieParser());


//configuracion de handlebars
app.engine("handlebars", handlebars.engine());
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

//rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/sessions', sessionRouter);

initializeStrategies();

app.listen(PORT, () =>console.log(`Servidor escuchando en el puerto ${PORT}`));
