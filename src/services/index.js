import PersistenceFactory from "../dao/PersistenceFactory.js";
import CartsRepository from "./repositories/cartsRepository.js";
import ProductsRepository from "./repositories/productsRepository.js";

const { ProductsDao, CartsDao } = await PersistenceFactory.getPersistence();

export const cartsService = new CartsRepository(CartsDao);
export const productsService = new ProductsRepository(ProductsDao);

console.log(productsService, cartsService);