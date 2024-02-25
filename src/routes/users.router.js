import { Router } from "express";
import UserManagerMongo from "../dao/Mongo/userManagerMongo.js";
import { passportCall } from "../middleware/passportCall.js";
import auth from "../middleware/authentication.middleware.js";


const userServices = new UserManagerMongo()
const usersRouter  = Router();

usersRouter.get('/', passportCall ('jwt'),auth(['userpremium','admin']), async (req, res) => {
    try {
        const users = await userServices.getUsers({})
        res.json({
            status: 'succes',
            result: users
        })
    } catch (error) {
        console.log(error)
    }
})
    
usersRouter.post('/', async (req, res) => {
        try {
            const { body } = req

            const result =await userServices.createUsers(body)

            res.status(200).send({
                status: "success",
                message: `El usuario ${first_name} ${last_name} ha sido creado con éxito`,
                usersCreate: result
            })
        } catch (error) {
            res.send({status: 'error', message: error})
        }
    })

usersRouter.get('/:uid', async (req, res) => {
        try {
            const { uid } = req.params
            const user = await userServices.getUser({ _id: uid })
            res.json({
                status: "success",
                message: `Usuario ${user.first_name} ${user.last_name} id "${uid}" encontrado`,
                result: user
            })
            res.send(result)
        } catch (error) {
            console.log(error)
        }
    })

usersRouter.put('/:uid', async (req, res) => {
        try {
            const { uid } = req.params
            const userToUpdate = req.body

            const result = await userServices.updateUser({ _id: uid }, userToUpdate, {new: true})//se usa para mostrar el usuario actualizado en tiempo real, dado que el sistema tenderá a mostrarnos el usuario actualizado pero sin actualizar
            res.status(200).send({
                status: "success",
                message: `El usuario ${result.first_name} ${result.last_name} con id "${uid}" ha sido actualizado`,
                result: result          
            })
        } catch (error) {
            console.log(error)
        }
    })

usersRouter.delete('/:uid', async (req, res) => {
        try {
            const { uid } = req.params
            const result = await userServices.deleteUser({ _id: uid })
            res.status(200).send({
                status: 'success',
                message: `El usuario ${result.first_name} ${result.last_name} con id ${result._id} ha sido eliminado`
            })
        } catch (error) {
            console.log(error)
        }
    })

export default usersRouter