import productModel from "../models/product.model.js"

export default class productsManager {

    getProducts = (params) => {
        return productModel.find(params).lean();
      };
   
    paginateProducts = async (params, paginateOptions) => {
        return productModel.paginate(params, paginateOptions);
    }    

    getProductBy = (params) => {
        return productModel.findOne(params).lean();
    }

    addProduct = (product) => {
        return productModel.create(product);
    }

    updateProduct = (id, product) => {
        return productModel.updateOne({ _id: id }, { $set: product });
    }

    deleteProduct = async (id) => {
        try {
            const updatedProduct = await productModel.findByIdAndUpdate(
                id,
                { $set: { status: false } },
                { new: true }
            );

            if (!updatedProduct) {
                throw new Error(`No se encontró el producto con ID ${id}`);
            }

            return updatedProduct;
        } catch (error) {
            throw error;
        }
    }
}