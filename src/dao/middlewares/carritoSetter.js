import cartManager from "../mongo/managers/cartsManager.js";

const cartService = new cartManager();

const cartSetter = async (req, res, next) => {
    if(!req.cookies.cart) {
        const cart = await cartService.addCart();
    }
}