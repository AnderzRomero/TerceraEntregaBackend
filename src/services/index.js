import UsersService from "./usersService.js";
import ProductsService from "./productsService.js";
import CartsService from "./cartsService.js";

import UsersManager from "../dao/mongo/managers/usersManager.js";
import ProductsManager from "../dao/mongo/managers/productsManager.js";
import CartsManager from "../dao/mongo/managers/cartsManager.js";


export const usersService = new UsersService(new UsersManager());
export const productsService = new ProductsService(new ProductsManager());
export const cartsService = new CartsService(new CartsManager());