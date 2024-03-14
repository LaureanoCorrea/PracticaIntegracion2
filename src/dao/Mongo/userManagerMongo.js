import usersModel from "../models/users.model.js";
import cartsModel from "../models/carts.model.js";

class UserManagerMongo {
  async getUser() {
    return await usersModel.findOne({});
  }

  async getUser(uid) {
    return await usersModel.findById({ _id: uid });
  }

  async getUserBy(query) {
    return await usersModel.findOne(query);
  }

  async getUserCartBy(userId) {
    try {
      const user = await usersModel.findOne({ _id: userId }).select('cart').exec();
      if (!user) {
        throw new Error("User not found");
      }
      return user.cart;
    } catch (error) {
      throw new Error(error.message);
    }
  }

  async createUsers(newUser) {
    try {
      const user = await usersModel.create(newUser);

      const newCart = await cartsModel.create({ products: [] });

      user.cart = newCart._id;

      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Error al crear el usuario: ${error.message}`);
    }
  }

  async updateUser(uid) {
    return await usersModel.updateOne({ _id: uid });
  }

  async deleteUser(uid) {
    return await usersModel.deleteOne({ _id: uid });
  }
}
export default UserManagerMongo;
