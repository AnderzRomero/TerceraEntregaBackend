import PersistenceFactory from "../dao/PersistenceFactory.js";


const persistence = await PersistenceFactory.getPersistence();
const userDao = persistence.UsersDao;
const cartsDao = persistence.CartsDao;
const productsDao = persistence.ProductsDao;

import UsersRepository from "./repositories/usersRepository.js";
import CartsRepository from "./repositories/cartsRepository.js";
import ProductsRepository from "./repositories/productsRepository.js";

export const usersService = new UsersRepository(userDao);
export const cartsService = new CartsRepository(cartsDao);
export const productsService = new ProductsRepository(productsDao);
console.log(cartsService);