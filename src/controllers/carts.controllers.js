import { cartsService } from "../services/index.js";
import { productsService } from "../services/index.js";
import cartModel from "../dao/mongo/models/cart.model.js";
import __dirname from "../utils.js";

const getCart = async (req, res) => {
    const cid = req.user.cart;
    const cart = await cartsService.getCartBy({ _id: cid });
    if (!cart) return res.status(400).send({ status: "error", error: "Carrito no encontrado" });
    res.render('Carts', {
        css: 'products',
        cart: cart
    })
}

const createCart = async (req, res) => {
    const cart = await cartsService.createCart();
    if (cart) return res.status(201).send({ status: "success", message: "Carrito creado", payload: cart._id });
    res.status(400).send({ message: "Error al crear carrito" });
}

const updateProductInCartNO_AUTH = async (req, res) => {
    const { cid, pid } = req.params;
    // Vamos a ver si existen y traer sus entidades
    const cart = await cartsService.getCartBy({ _id: cid });
    if (!cart) return res.status(400).send({ status: "error", error: "Carrito no existe" });
    const product = await productsService.getProductBy({ _id: pid });
    if (!product) return res.status(400).send({ status: "error", error: "Producto no existe" });

    const productExisteInCarrito = cart.products.find(product => {
        return product._id._id.toString() === pid
    })
    if (productExisteInCarrito) {
        // Incrementar la cantidad del producto en el carrito
        productExisteInCarrito.quantity += 1;

        // Guardar los cambios en el carrito
        await cartsService.updateProductQuantity({ _id: cid }, cart.products);

        // Retornar una respuesta exitosa
        return res.status(200).send({ status: 'success', message: 'Cantidad del producto incrementada en el carrito' });
    } else {
        cart.products.push({
            _id: pid
        })
        await cartModel.updateOne({ _id: cid }, { $set: { products: cart.products } });
        res.send({ status: "success", message: "Producto agregado al carro" });
    }
}

const updateProductInCart = async (req, res) => {
    const { pid } = req.params;
    const cart = await cartsService.getCartBy({ _id: req.user.cart });
    if (!cart) return res.status(400).send({ status: "error", error: "Carrito no existe" });
    const product = await productsService.getProductBy({ _id: pid });
    if (!product) return res.status(400).send({ status: "error", error: "Producto no existe" })

    const productExisteInCarrito = cart.products.find(product => {
        return product._id._id.toString() === pid
    })
    if (productExisteInCarrito) {
        // Incrementar la cantidad del producto en el carrito
        productExisteInCarrito.quantity += 1;

        // Guardar los cambios en el carrito
        await cartsService.updateProductQuantity({ _id: req.user.cart }, cart.products);

        // Retornar una respuesta exitosa
        return res.status(200).send({ status: 'success', message: 'Cantidad del producto incrementada en el carrito' });
    } else {
        cart.products.push({
            _id: pid
        })
        await cartModel.updateOne({ _id: req.user.cart }, { $set: { products: cart.products } });
        res.send({ status: "success", message: "Producto agregado al carro" });
    }
}

const deleteProductInCart = async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const carritoActualizado = await cartsService.removeProductFromCart(cid, pid);
        res.status(200).send({ status: "success", message: "Producto eliminado del carrito", cart: carritoActualizado });
    } catch (error) {
        res.status(500).send({ error: error.message });
    }
}

const deleteAllProductsInCart = async (req, res) => {

}

export default {
    getCart,
    createCart,
    updateProductInCartNO_AUTH,
    updateProductInCart,
    deleteProductInCart,
    deleteAllProductsInCart
}