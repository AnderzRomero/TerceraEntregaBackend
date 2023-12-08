import BaseRouter from './BaseRouter.js';
import { getValidFilters } from "../utils.js";
import productsManager from "../dao/mongo/managers/productsManager.js";
import uploader from "../services/uploadService.js";
import config from '../config/config.js';

const productsService = new productsManager();

class ProductsRouter extends BaseRouter {
  init() {
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
    // EndPoint para traer producto por ID
    this.get("/:pid", ['PUBLIC'], async (req, res) => {
      const { pid } = req.params;
      const product = await productsService.getProductBy({ _id: pid });
      if (!product) {
        res.status(400).json({ message: "Producto no encontrado" });
      } else {
        res.send({ status: "success", payload: product })
      }

    });

    // EndPoint para crear producto 
    this.post("/", ['ADMIN'], uploader.array('thumbnail'), async (req, res) => {
      const {
        title,
        description,
        category,
        code,
        stock,
        price
      } = req.body;
      // validamos que todos los campos esten llenos
      if (!title || !description || !category || !code || !stock || !price) return res.status(400).send({ status: "error", error: "Valores incompletos" });

      const newProduct = {
        title,
        description,
        category,
        code,
        stock,
        price
      }
      const thumbnail = req.files.map(file => `${req.protocol}://${req.hostname}:${config.app.PORT}/img/${file.filename}`);
      newProduct.thumbnail = thumbnail

      const result = await productsService.addProduct(newProduct);
      res.send({ status: "success", payload: result._id });
    });

    // EndPoint para Actualizar producto por ID
    this.put("/:pid", ['ADMIN'], async (req, res) => {
      const { pid } = req.params;

      const {
        title,
        description,
        category,
        stock,
        price,
        status
      } = req.body;

      const updateProduct = {
        title,
        description,
        category,
        stock,
        price,
        status
      }

      const product = await productsService.getProductBy({ _id: pid });
      if (!product) return res.status(400).send({ status: "error", error: "Producto no encontrado" });
      await productsService.updateProduct(pid, updateProduct);
      res.send({ status: "success", message: "Producto Actualizado" });
    });

    // EndPoint para eliminar producto por ID
    this.delete("/:pid", ['ADMIN'], async (req, res) => {
      const { pid } = req.params;

      const product = await productsService.getProductBy({ _id: pid });
      if (!product) return res.status(400).send({ status: "error", error: "Producto no encontrado" });
      await productsService.deleteProduct(pid)
      res.send({ status: "success", message: "Producto eliminado" });
    });
  }
}

const productsRouter = new ProductsRouter();

export default productsRouter.getRouter();
