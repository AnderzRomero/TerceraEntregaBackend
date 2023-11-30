import { Router } from "express";
import ProductManager from "../dao/mongo/managers/productsManager.js";
import passportCall from "../middlewares/passportCall.js";

const router = Router();
const productsService = new ProductManager();


router.get("/realTimeProducts", async (req, res) => {
  const listaProductos = await productsService.getProducts();
  res.render("realTimeProducts", { listaProductos });
});

router.get("/messages", (req, res) => {
  res.render("messages");
});

// rutas para el sistema de login 
router.get('/', async (req, res) => {
  res.redirect('/login');
  if (passportCall("jwt")) {
    if (req.user) {
      return res.redirect('/login');
    } else if (!req.user) {
      console.log("No estoy logeado");
      res.render('profile', { user: req.user });
    }
  }
})

router.get('/login', async (req, res) => {
  res.render('login')
})

router.get('/register', async (req, res) => {
  res.render('register')
})


export default router;
