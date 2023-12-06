import cartsManager from "../dao/mongo/managers/cartsManager.js";

const cartsService = new cartsManager();

const cartSetter = async (req, res, next) => {
    if (!req.cookies.cart && !req.user) {
        const cart = await cartsService.addCart();
        res.cookie('cart', cart._id.toString())
    }
    next();
}

export default cartSetter;