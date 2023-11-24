import cartManager from "../dao/mongo/managers/cartsManager.js";

const cartService = new cartManager();

const cartSetter = async (req, res, next) => {
    if (!req.cookies.cart) {
        const cart = await cartService.addCart();
        res.cookie('cart', cart._id.toString());
    }
    next();
}

export default cartSetter;