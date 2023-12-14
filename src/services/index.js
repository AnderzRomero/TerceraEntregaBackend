import PersistenceFactory from "../dao/PersistenceFactory.js";
import CartsRepository from "./repositories/cartsRepository.js";
import ProductsRepository from "./repositories/productsRepository.js";


const persistence = await PersistenceFactory.getPersistence();
const cartsDao = persistence.CartsDao;
const productsDao = persistence.ProductsDao;


export const cartsService = new CartsRepository(cartsDao);
export const productsService = new ProductsRepository(productsDao);