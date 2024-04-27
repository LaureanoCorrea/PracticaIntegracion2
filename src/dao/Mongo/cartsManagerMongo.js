import cartsModel from "../models/carts.model.js";

class CartManagerMongo {
    async getCarts() {
        return await cartsModel.find({});
      }
    
      async getCartByUserId(userId) {
        return await cartsModel.findOne({ user: userId });
      }
    
      async getCartById(cid) {
        return await cartsModel.findById(cid);
     }
    
      async getCartByIdLean(cid) {
        return await cartsModel.findById(cid).lean();
      }
    
      async create({ userEmail }) {
        return cartsModel.create({ userEmail, products: [] });
      }
      
    
      async addToCart(cid, pid, quantity) {
        const cart = await cartsModel.getCartById(cid);
        const existingProduct = cart.products.find(item => item.product.equals(pid));
        existingProduct 
          ? existingProduct.quantity += quantity
          : cart.products.push({ product: pid, quantity });
        await cart.save();
        return cart;
      }
      
    
      async updateCart(cid, pid, nuevaCantidad) {
        return await cartsModel.findByIdAndUpdate(
          cid,
          { $set: { "products.$[elem].quantity": nuevaCantidad } },
          {
            new: true,
            arrayFilters: [{ "elem._id": pid }],
          }
        );
      }
    
      async removeFromCart(cid, pid) {
        const cart = await cartsModel.getCartById(cid);
        cart.products = cart.products.filter(item => item._id.toString() !== pid.toString());
        await cart.save();
        return cart;
      }
      
    
      async removeAllFromCart(cid) {
        const cart = await cartsModel.getCartById(cid);
        cart.products = [];
        await cart.save();
        return cart;
      }
    
      async deleteCart(cid) {
        return await cartsModel.findByIdAndDelete(cid);
      }
    }

export default CartManagerMongo;
