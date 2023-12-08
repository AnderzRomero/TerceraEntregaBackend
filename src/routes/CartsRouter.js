import BaseRouter from "./BaseRouter.js";
import cartManager from "../dao/mongo/managers/cartsManager.js";
import productsManager from "../dao/mongo/managers/productsManager.js";

import __dirname from "../utils.js";
import cartModel from "../dao/mongo/models/cart.model.js";


const cartService = new cartManager();
const productService = new productsManager();

class CartsRouter extends BaseRouter {
  init() {
    this.get("/", ['USER'], async (req, res) => {
      const cid = req.user.cart;
      const cart = await cartService.getCartById({ _id: cid });
      if (!cart) return res.status(400).send({ status: "error", error: "Carrito no encontrado" });
      res.render('Carts',{
        css: 'products',
        cart: cart
      })

    })

    this.get("/:cid", ['USER'], async (req, res) => {
      const { cid } = req.params;
      const cart = await cartService.getCartById({ _id: cid });
      if (!cart) return res.status(400).send({ status: "error", error: "Carrito no encontrado" });
      res.send({ status: "success", payload: cart })
    });

    this.post("/", ['ADMIN'], async (req, res) => {
      const cart = await cartService.addCart();
      if (cart) return res.status(201).send({ status: "success", message: "Carrito creado", payload: cart._id });
      res.status(400).send({ message: "Error al crear carrito" });
    });

    this.put('/:cid/products/:pid', ['NO_AUTH'], async (req, res) => {
      const { cid, pid } = req.params;
      // Vamos a ver si existen y traer sus entidades
      const cart = await cartService.getCartById({ _id: cid });
      if (!cart) return res.status(400).send({ status: "error", error: "Carrito no existe" });
      const product = await productService.getProductBy({ _id: pid });
      if (!product) return res.status(400).send({ status: "error", error: "Producto no existe" });

      const productExisteInCarrito = cart.products.find(product => {
        return product._id._id.toString() === pid
      })
      if (productExisteInCarrito) {
        // Incrementar la cantidad del producto en el carrito
        productExisteInCarrito.quantity += 1;

        // Guardar los cambios en el carrito
        await cartService.updateProductQuantity({ _id: cid }, cart.products);

        // Retornar una respuesta exitosa
        return res.status(200).send({ status: 'success', message: 'Cantidad del producto incrementada en el carrito' });
      } else {
        cart.products.push({
          _id: pid
        })
        await cartModel.updateOne({ _id: cid }, { $set: { products: cart.products } });
        res.send({ status: "success", message: "Producto agregado al carro" });
      }
    })

    this.put('/products/:pid', ['USER'], async (req, res) => {
      const { pid } = req.params;
      const cart = await cartService.getCartById({ _id: req.user.cart });
      if (!cart) return res.status(400).send({ status: "error", error: "Carrito no existe" });
      const product = await productService.getProductBy({ _id: pid });
      if (!product) return res.status(400).send({ status: "error", error: "Producto no existe" })

      const productExisteInCarrito = cart.products.find(product => {
        return product._id._id.toString() === pid
      })
      if (productExisteInCarrito) {
        // Incrementar la cantidad del producto en el carrito
        productExisteInCarrito.quantity += 1;

        // Guardar los cambios en el carrito
        await cartService.updateProductQuantity({ _id: req.user.cart }, cart.products);

        // Retornar una respuesta exitosa
        return res.status(200).send({ status: 'success', message: 'Cantidad del producto incrementada en el carrito' });
      } else {
        cart.products.push({
          _id: pid
        })
        await cartModel.updateOne({ _id: req.user.cart }, { $set: { products: cart.products } });
        res.send({ status: "success", message: "Producto agregado al carro" });
      }
    })

    this.delete('/:cid/products/:pid', ['ADMIN'], async (req, res) => {
      const { cid, pid } = req.params;

      try {
        const carritoActualizado = await cartService.removeProductFromCart(cid, pid);
        res.status(200).send({ status: "success", message: "Producto eliminado del carrito", cart: carritoActualizado });
      } catch (error) {
        res.status(500).send({ error: error.message });
      }
    });
  }
}

const cartsRouter = new CartsRouter();

export default cartsRouter.getRouter();
