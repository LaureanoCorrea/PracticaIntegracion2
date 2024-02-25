import { Router } from "express";
import usersRouter from "./users.router.js";
// import UserRouter from "./userClass.router.js";
import cartsRouter from "./carts.router.js";
import sessionsRouter from "./sessions.router.js";
import viewsRouter from "./views.router.js"
import productsRouter from "./products.router.js";
import messagesRouter from "./messages.router.js";
import pruebasRouter from "./pruebas.router.js";

const router = Router()
// const usersRouter = new UserRouter()

// router.use('/api/users', usersRouter.getRouter())


router.use('/api/sessions', sessionsRouter)
router.use('/api/users', usersRouter)
router.use('/api/carts', cartsRouter)
router.use('/api/products', productsRouter)
router.use('/api/messages', messagesRouter)
router.use('/pruebas', pruebasRouter)
router.use('/', viewsRouter)

router.get('*', (req,res) =>{
    res.render('404', {
        style: 'index.css'
    })
})

export default router