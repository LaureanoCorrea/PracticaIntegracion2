import usersModel from "../models/users.model.js";

class UserManagerMongo {
    async getUsers(){
        return await usersModel.find({})
    }

    async getUser(uid){
        return await usersModel.findById({_id: uid})
    }

    async getUserBy(query) {
        return await usersModel.findOne(query);
    }
    
    async createUsers(newUser){
        return await usersModel.create(newUser)
    }

    async updateUser(uid){
        return await usersModel.updateOne({_id: uid})
    }
    
    async deleteUser(uid){
        return await usersModel.deleteOne({_id: uid})
    }
}
export default UserManagerMongo