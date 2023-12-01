import { Router } from "express";
import cartManager from "../dao/mongo/managers/cartsManager.js";
import productsManager from "../dao/mongo/managers/productsManager.js";
import __dirname from "../utils.js";
import cartModel from "../dao/mongo/models/cart.model.js";

const router = Router();
const cartService = new cartManager();
const productService = new productsManager();

router.get("/", async (req, res) => {
  const carts = await cartService.getCarts();
  if (carts.length === 0) {
    res.status(200).json({ message: "No hay carros creados" });
  } else {
    res.status(200).json({ carts });
  }
});

router.get("/:cid", async (req, res) => {
  const { cid } = req.params;
  const cart = await cartService.getCartById({ _id: cid });
  if (!cart) {
    res.status(400).json({ message: "Carrito no encontrado" });
  } else {
    res.send({ status: "success", payload: cart })
  }
});

router.post("/", async (req, res) => {
  const cart = await cartService.addCart();
  if (cart) {
    res.status(201).json({ message: "Carrito creado", cart });
  } else {
    res.status(400).json({ message: "Error al crear carrito" });
  }
});

router.put('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;
  // Vamos a ver si existen y traer sus entidades
  const cart = await cartService.getCartById({ _id: cid });
  if (!cart) return res.status(400).send({ status: "error", error: "Carrito no existe" });
  const product = await productService.getProductBy({ _id: pid });
  if (!product) return res.status(400).send({ status: "error", error: "Producto no existe" });

  const productExisteInCarrito = cart.products.find((product) =>
    product._id._id.toString() === pid
  );

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

router.delete('/:cid/products/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const carritoActualizado = await cartService.removeProductFromCart(cid, pid);
    res.status(200).json({ status: "success", message: "Producto eliminado del carrito", cart: carritoActualizado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
