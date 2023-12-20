import express from "express";
import exphbs from 'express-handlebars';
import cookieParser from "cookie-parser";
import "./dao/mongo/dbConfig.js";

import viewsRouter from "./routes/ViewsRouter.js";
import SessionsRouter from "./routes/SessionsRouter.js";
import productsRouter from "./routes/ProductsRouter.js";
import cartsRouter from "./routes/CartsRouter.js";

import __dirname from "./utils.js";
import initializeStrategies from "./config/passport.config.js";
import config from "./config/config.js";

const app = express();
const PORT = config.app.PORT;

app.listen(PORT, () => console.log(`Servidor escuchando en el puerto ${PORT}`));

// middlewars
app.use(express.urlencoded({ extended: true }));
app.use(express.static(`${__dirname}/public`));
app.use(express.json());
app.use(cookieParser());

//configuracion de handlebars
const hbs = exphbs.create({
    helpers: 
    {
        sumPrice: function (products) 
        {
            let total = 0;
            for (const product of products) {
                total += product._id.price * product.quantity;
            }
            return total;
        },
        subtotal: function(value1, value2){
            return value1 * value2;
        }
    }
});

hbs.allowProtoPropertiesByDefault = true;

app.engine("handlebars", hbs.engine); // Usa hbs.engine en lugar de handlebars.engine()
app.set("views", `${__dirname}/views`);
app.set("view engine", "handlebars");

initializeStrategies();

//rutas
app.use("/", viewsRouter);
app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);
app.use('/api/sessions', SessionsRouter);