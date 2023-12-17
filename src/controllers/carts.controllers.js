import { cartsService } from "../services/index.js";
import { productsService } from "../services/index.js";
import { ticketsService } from "../services/index.js";
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

const purchaseCart = async (req, res) => {
    try {
        const userId = req.user.id;
        const cartId = req.user.cart;
        const sumProducts = req.body.sumTotalPrice;
        const cart = await cartsService.getCartBy({ _id: cartId });

        if (!cartId) return res.status(404).send("Error: Carrito no encontrado");

        // Verifica el stock de cada producto en el carrito
        const productsInCart = cart.products;
        const purchasedProducts = []; // Almacenará los productos comprados
        
        for (const productInCart of productsInCart) {
            const productId = productInCart._id._id;
            const product = await productsService.getProductBy(productId);
            console.log("Id del producto en el carro",product);

            if (!product) return res.status(404).send("Error: Producto no encontrado");
            if (product.stock >= productInCart.quantity) purchasedProducts.push(productInCart);

            product.stock -= productInCart.quantity;
            // const updateProduct = await productsService.updateProduct(productId, product);
        }

        console.log("Almacen de productos comprados",purchasedProducts);
        console.log("Stock de productos despues de comprar productos al carrito",productsInCart);

        // // Actualiza el carrito con los productos que no se compraron
        // const updatedProducts = productsInCart.filter(productInCart => !purchasedProducts.includes(productInCart));
        // cart.products = updatedProducts;
        // await cart.save();

        // const ticket = await ticketsService.createTicket(userId, cartId, sumProducts);

        // console.log(ticket);
        return res.status(200).send("Compra exitosa");
    } catch (error) {
        return res.status(500).send("Error en servidor: " + error.message);
    }
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
    purchaseCart,
    updateProductInCartNO_AUTH,
    updateProductInCart,
    deleteProductInCart,
    deleteAllProductsInCart
}