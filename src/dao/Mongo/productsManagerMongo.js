import productModel from "../models/products.model.js";

class ProductManagerMongo {
  async getProductsPaginated(filter, options) {
    return await productModel.paginate(filter, options);
  }
  
  async getProduct(pid) {
    return await productModel.findOne({ _id: pid }).lean();
  }

  async createProducts(newProduct) {
    return await productModel.create(newProduct);
  }

  async updateProduct(pid) {
    return await productModel.updateOne({ _id: pid });
  }

  async deleteProduct(pid) {
    return await productModel.deleteOne({ _id: pid });
  }
}
export default ProductManagerMongo;
