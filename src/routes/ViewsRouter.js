import BaseRouter from "./BaseRouter.js";
import { getValidFilters } from "../utils.js";
import productsManager from "../dao/mongo/managers/productsManager.js";

const productsService = new productsManager();

class ViewsRouter extends BaseRouter {
  init() {
    // rutas para el sistema de login 
    // this.get('/', ['NO_AUTH'], async (req, res) => {
    //   res.redirect('/login');
    // });
    this.get('/login', ['NO_AUTH'], async (req, res) => {
      res.render('login')
    });
    this.get('/register', ['NO_AUTH'], async (req, res) => {
      res.render('register')
    });
    this.get('/profile', ['AUTH'], async (req, res) => {
      res.render('Profile');
    });
    // EndPoint para traer todos los productos
    this.get('/', ['PUBLIC'], async (req, res) => {
      let { page = 1, limit = 4, sort, ...filters } = req.query;
      const cleanFilters = getValidFilters(filters, 'product')

      // Añadir lógica de ordenación por precio
      const sortOptions = {};
      if (sort === 'asc') {
        sortOptions.price = 1; // Orden ascendente por precio
      } else if (sort === 'desc') {
        sortOptions.price = -1; // Orden descendente por precio
      }

      const pagination = await productsService.paginateProducts(cleanFilters, { page, lean: true, limit, sort: sortOptions });
      res.render('Products', {
        css: 'products',
        user: req.user,
        products: pagination.docs,
        page: pagination.page,
        hasPrevPage: pagination.hasPrevPage,
        hasNextPage: pagination.hasNextPage,
        prevPage: pagination.prevPage,
        nextPage: pagination.nextPage,
        totalPages: pagination.totalPages
      });
    });
  }
}

const viewsRouter = new ViewsRouter();

export default viewsRouter.getRouter();