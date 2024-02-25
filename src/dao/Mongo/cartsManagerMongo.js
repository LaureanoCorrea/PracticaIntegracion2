import cartsModel from "../models/carts.model.js";

class CartManagerMongo {
    
    async getCarts() {
        try {
            return await cartsModel.find({});
        } catch (error) {
            throw new Error('Error al obtener los carritos');
        }
    }

    async findById(cid) {
        try {
            return await cartsModel.findById({ _id: cid });
        } catch (error) {
            throw new Error('Error al obtener el carrito por ID');
        }
    }

    async getCart(cid) {
        try {
            return await cartsModel.findOne({ _id: cid });
        } catch (error) {
            throw new Error('Error al obtener el carrito');
        }
    }

    async createCart(newCart) {
        try {
            return await cartsModel.create(newCart);
        } catch (error) {
            throw new Error('Error al crear el carrito');
        }
    }

    async updateCart(cid, cartData) {
        try {
            return await cartsModel.findByIdAndUpdate(cid, cartData, { new: true });
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

export default new CartManagerMongo();
