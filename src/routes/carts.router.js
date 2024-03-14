import { Router } from "express";
import cartsManagerMongo from "../dao/Mongo/cartsManagerMongo.js";
import cartsModel from "../dao/models/carts.model.js";
import { passportCall } from "../middleware/passportCall.js";
import UserManagerMongo from "../dao/Mongo/userManagerMongo.js";

const cartsRouter = Router();
const cartService = new cartsManagerMongo();
const sessionService = new UserManagerMongo();

cartsRouter.get("/cart", passportCall("jwt"), async (req, res) => {
  try {
    const userId = req.user.id;
    const cart = await cartService.getCartBy(userId); // Obtener el carrito del usuario actual
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito especificado no existe",
      });
    }
    res.send({ cart }); // Devolver el carrito encontrado
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});
         

cartsRouter.post("/cart/:productId", passportCall("jwt"), async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    const quantity = req.body.quantity || 1;

    const cart = await sessionService.getUserCartBy(userId); // Obtener el carrito del usuario
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito especificado no existe",
      });
    }

    cart.products.push({ product: productId, quantity }); // Agregar el producto al carrito
    await cart.save(); // Guardar el carrito actualizado en la base de datos

    res.redirect(`/product-added/${productId}`); // Redirigir al usuario después de agregar el producto
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});


cartsRouter.delete("/cart/remove/:productId", passportCall("jwt"), async (req, res) => {
  try {
    const userId = req.user.id;
    const productId = req.params.productId;
    await cartService.updateCart(userId, productId, -1);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});
  
cartsRouter.delete("/cart/clear", passportCall("jwt"), async (req, res) => {
  try {
    const userId = req.user.id;
    await cartService.deleteCart(userId);
    res.sendStatus(204);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: 'error',
      message: 'Error interno del servidor',
    });
  }
});
  
  export default cartsRouter;
  