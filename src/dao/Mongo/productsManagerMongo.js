import productModel from "../models/products.model.js"

class ProductManagerMongo {

    async getProductsPaginated(options){
        const { limit, page, sort, query } = options;

        try {
            const result = await productModel.paginate(query, {
                limit,
                page,
                sort,
                lean: true // Asegúrate de que la opción lean esté configurada si necesitas objetos JavaScript planos
            });

            return result;
        } catch (error) {
            throw new Error('Error al obtener productos paginados');
        }
    }

    async getProducts(){
        return await productModel.find({})
    }

    async getProduct(pid){
        return await productModel.findOne({_id: pid})
    }
    
    async createProducts(newProduct){
        return await productModel.create(newProduct)
    }
    
    async updateProduct(pid){
        return await productModel.updateOne({_id: pid})
    }
    
    async deleteProduct(pid){
        return await productModel.deleteOne({_id: pid})
    }
}
export default new ProductManagerMongo()