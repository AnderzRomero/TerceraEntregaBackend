import { productsService } from "../services/index.js";
import { getValidFilters } from "../utils.js";
import CloudStorageService from "../services/CloudStorageService.js";

const getproducts = async (req, res) => {
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
}

const getProductBy = async (req, res) => {
    const { pid } = req.params;
    const product = await productsService.getProductBy({ _id: pid });
    if (!product) {
        res.status(400).json({ message: "Producto no encontrado" });
    } else {
        res.send({ status: "success", payload: product })
    }
}

const createProduct = async (req, res) => {
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

    const googleStorageService = new CloudStorageService();
    const thumbnail = []

    for (const file of req.files) {
        const url = await googleStorageService.uploadFileToCloudStorage(file);
        thumbnail.push(url);
    }

    newProduct.thumbnail = thumbnail
    //Ya creé el objeto, ya mapeé las imágenes, ahora sí, inserto en la base
    const result = await productsService.createProduct(newProduct);
    res.send({ status: "success", payload: result._id });
}

const updateProductBy = async (req, res) => {
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
}
const deleteProductBy = async (req, res) => {
    const { pid } = req.params;

    const product = await productsService.getProductBy({ _id: pid });
    if (!product) return res.status(400).send({ status: "error", error: "Producto no encontrado" });
    await productsService.deleteProduct(pid)
    res.send({ status: "success", message: "Producto eliminado" });
}

export default {
    getproducts,
    getProductBy,
    createProduct,
    updateProductBy,
    deleteProductBy
}

