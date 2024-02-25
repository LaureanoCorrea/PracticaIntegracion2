import { Router } from "express";
import CartManagerMongo from "../dao/Mongo/cartsManagerMongo.js";

const cartsRouter = Router();

cartsRouter.get("/", async (req, res) => {
  try {
    const carts = await CartManagerMongo.getCart().lean;

    res.status(200).json(carts);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
})

cartsRouter.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    const newCart = await CartManagerMongo.create({ products });

    res.status(201).json({
      status: "success",
      message: 'Carrito agregado exitosamente "vacio"',
      cart: newCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

cartsRouter.post("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const productId = pid;
    const quantity = 1;
    const _id = "65c2865ee7d8464e663be2b9";

    const cart = await CartManagerMongo.findById(_id);
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito especificado no existe",
      });
    }

    cart.products.push({ product: productId, quantity });
    const updatedCart = await cart.save();
    res.redirect(`/product-added/${productId}`);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});


cartsRouter.put("/:cid", async (req, res) => {
  try {
    const { cid } = "65c2865ee7d8464e663be2b9";
    const { products } = req.body;
    
    const updatedCart = await CartManagerMongo.findByIdAndUpdate(
      cid,
      { products },
      { new: true }
      );

    if (!updatedCart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito solicitado no existe",
      });
    }
    
    res.status(200).json({
      status: "success",
      message: `El carrito ${cid} ha sido actualizado`,
      cart: updatedCart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

cartsRouter.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid } = "65c2865ee7d8464e663be2b9";
    const { pid } = req.params;
    const { quantity } = req.body;
    const cart = await CartManagerMongo.findById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito solicitado no existe",
      });
    }
    
    const productIndex = cart.products.findIndex(
      (item) => item.product.toString() === pid
    );

    if (productIndex === -1) {
      return res.status(404).json({
        status: "error",
        message: "El producto no existe en el carrito",
      });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.status(200).json({
      status: "success",
      message: "Cantidad de ejemplares actualizada con éxito",
      cart,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

cartsRouter.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid } = "65c2865ee7d8464e663be2b9";
    const { pid } = req.params;
    const cart = await CartManagerMongo.findById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito solicitado no existe",
      });
    }

    cart.products = cart.products.filter(
      (item) => item.product.toString() !== pid
    );
    await cart.save();

    const updatedCart = await CartManagerMongo.findById(cid);
    // io.emit('cartUpdated', { cart: updatedCart });

    res.render('cart',{
      cart: updatedCart,
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

cartsRouter.delete("/:cid", async (req, res) => {
  try {
    const { cid } = "65c2865ee7d8464e663be2b9";
    const cart = await CartManagerMongo.findById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito solicitado no existe",
      });
    }

    cart.products = [];
    await cart.save();

    res.status(200).json({
      status: "success",
      message: `El carrito ${cid} ha sido vaciado`,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

export default cartsRouter;
