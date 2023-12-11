import BaseRouter from "./BaseRouter.js";
import cartsControllers from "../controllers/carts.controllers.js";

class CartsRouter extends BaseRouter {
  init() {
    // Endpoint para obtener carrito
    this.get("/", ['USER'], cartsControllers.getCart);
    // Endpoint para crear carrito
    this.post("/", ['ADMIN'], cartsControllers.createCart);
    // Endpoint para actualizar o agregar producto al carrito sin iniciar session
    this.put('/:cid/products/:pid', ['NO_AUTH'], cartsControllers.updateProductInCartNO_AUTH);
    // Endpoint para actualizar o agregar producto al carrito Autenticado
    this.put('/products/:pid', ['USER'], cartsControllers.updateProductInCart);
    // Endpoint para eliminar producto del carrito
    this.delete('/:cid/products/:pid', ['ADMIN'], cartsControllers.deleteProductInCart);
  }
}

const cartsRouter = new CartsRouter();

export default cartsRouter.getRouter();
