import usersModel from "../models/users.model.js";

class UserManagerMongo {
  async getUsers() {
    return await usersModel.find({});
  }

  async getUser(filter) {
    return await usersModel.findOne(filter);
  }

  async getUserBy(query) {
    return await usersModel.findOne(query);
  }

  async createUser(newUser) {
    return await usersModel.create(newUser);
  }

  async updateUser(uid, userToUpdate) {
    return await usersModel.updateOne({ _id: uid }, userToUpdate, {
      new: true,
    });
  }

  async deleteUser(uid) {
    return await usersModel.deleteOne({ _id: uid });
  }

  async updateUserCart(userId, cid) {
    return await usersModel.findByIdAndUpdate(
      userId,
      { cart: cid },
      { new: true }
    );
  }
}
export default UserManagerMongo;
