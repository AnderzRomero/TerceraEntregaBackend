export default class ProductsService {
    constructor(manager){
        this.manager = manager;
    }

    getProducts = (params) =>{
        return this.manager.get(params);
    }

    paginateProducts = (params, paginateOptions) =>{
        return this.manager.paginateProducts(params, paginateOptions);
    }

    getProductBy = (params) =>{
        return this.manager.getBy(params);
    }

    createProduct = (product) =>{
        return this.manager.create(product);
    }

    updateProduct = (id, product) =>{
        return this.manager.update(id, product);
    }

    deleteProduct = (id) =>{
        return this.manager.delete(id);
    }
}

