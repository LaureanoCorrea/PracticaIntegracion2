import cartsModel from "../models/carts.model.js";
import { ObjectId } from "mongodb";

class CartManagerMongo {
    async getCarts() {
        try {
            return await cartsModel.find({});
        } catch (error) {
            throw new Error('Error al obtener los carritos');
        }
    }

    async getCartBy(userId) {
        try {
          const cart = await cartsModel.findOne({ userId: userId });
          if (!cart) {
            throw new Error("Cart not found for user");
          }
          return cart;
        } catch (error) {
          throw new Error(`Error getting cart: ${error.message}`);
        }
      }
      
    
    // async getCartLean(userId) {
    //     try {
    //         const cart = await cartsModel.findOne({ userId: userId }).lean();
    //         if (!cart) {
    //           throw new Error("Cartlean not found for user");
    //         }
    //         return cart;
    //       } catch (error) {
    //         throw new Error(`Error getting cart: ${error.message}`);
    //       }
    //     }

    async create(newCart) {
        try {
            return await cartsModel.create(newCart);
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    async addProductToCart(cartId, productId, quantity) {
        try {
            let cart = await cartsModel.findById(cartId);
            if (!cart) {
                cart = await cartsModel.create({ _id: cartId, products: [] });
            }
            const existingProductIndex = cart.products.findIndex(item => item.product.toString() === productId);
            if (existingProductIndex !== -1) {
                cart.products[existingProductIndex].quantity += quantity;
            } else { 
                cart.products.push({ product: productId, quantity });
            }
            await cart.save();
            return cart;
        } catch (error) {
            throw new Error('Error al agregar el producto al carrito: ' + error.message);
        }
    }

    async updateCart(cartId, cartData) {
        try {
            return await cartsModel.findByIdAndUpdate(cartId, cartData, { new: true });
        } catch (error) {
            throw new Error('Error al actualizar el carrito');
        }
    }

    async deleteCart(cid) {
        try {
            return await cartsModel.findByIdAndDelete(cid);
        } catch (error) {
            throw new Error('Error al eliminar el carrito');
        }
    }
}

export default CartManagerMongo;
