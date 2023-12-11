
export default class CartsService {
    constructor(manager) {
        this.manager = manager;
    }
    getCarts = (params) => {
        return this.manager.get(params);
    }
    getCartBy = (cartId) => {
        return this.manager.getBy(cartId);
    }
    createCart = (products) => {
        return this.manager.create(products);
    }
    updateCart = (cartId, newProducts) => {
        return this.manager.update(cartId, newProducts);
    }
    updateProductQuantity = (cartId, updatedProducts) => {
        return this.manager.updateProductQuantity(cartId, updatedProducts);
    }
    deleteAllProductsInCart = (cartId) => {
        return this.manager.deleteAllProductsInCart(cartId);
    }
    removeProductFromCart = (cartId, productId) => {
        return this.manager.removeProductFromCart(cartId, productId);
    }


}