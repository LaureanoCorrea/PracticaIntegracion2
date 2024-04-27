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
    const cid = req.user.cart;
    const cart = await this.cartService.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito especificado no existe",
      });
    }

    res.render("cart", {
      cid, // Utilizar el ID del carrito obtenido
      cart, // Pasar el carrito directamente como una propiedad
      style: "index.css",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});
         

cartsRouter.post("/cart/:pid", passportCall("jwt"), async (req, res) => {
  try {
    const { pid, quantity } = req.body;
    const cid = req.user.cart;

    const cart = await this.cartService.addToCart(
      cid,
      pid,
      quantity
    );
    res.status(200).json({
      status: "success",
      message: "Producto agregado al carrito exitosamente",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor al agregar el producto al carrito",
    });
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
  