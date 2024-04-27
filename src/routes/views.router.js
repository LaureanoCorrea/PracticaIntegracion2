import { Router } from "express";
import productsModel from "../dao/models/products.model.js";
import UserManagerMongo from "../dao/Mongo/userManagerMongo.js";
import { passportCall } from "../middleware/passportCall.js";
import authorization from "../middleware/authentication.middleware.js";
import CartManagerMongo from "../dao/Mongo/cartsManagerMongo.js";

const router = Router();
const sessionService = new UserManagerMongo();
const cartService = new CartManagerMongo();

router.get(
  "/products",
  passportCall("jwt"),
  authorization(["admin", "user"]),
  async (req, res) => {
    const { limit = 10, page = 1, sort = "", query = "" } = req.query;

    try {
      const options = {
        limit,
        page,
        sort: sort || {},
        query,
        lean: true,
      };

      const {
        docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page: currentPage,
      } = await productsModel.paginate({}, options);

      const user = req.user;
      let username = "";
      if (user) {
        const userData = await sessionService.getUserBy({ id: user._id });
        if (userData) {
          username = userData.first_name;
        }
      }

      const role = user ? user.role : "";

      res.render("products", {
        username,
        role,
        products: docs,
        hasPrevPage,
        hasNextPage,
        prevPage,
        nextPage,
        page: currentPage,
        style: "index.css",
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Error interno del servidor");
    }
  }
);

router.get("/chat", (req, res) => {
  res.render("chat", {
    style: "index.css",
  });
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productsModel.find({});
    res.render("realTimeProducts", {
      productos: products,
      style: "index.css",
    });
  } catch (error) {
    console.log(error);
    res.json("Error al intentar obtener la lista de productos!");
    return;
  }
});

router.get("/productDetails/:pid", passportCall("jwt"), async (req, res) => {
  const { pid } = req.params;
  console.log('id', req.user.cart)
  try {
    const product = await productsModel.findById(pid).lean();
    res.render("productDetails", {
      product,
      style: "index.css",
    });
  } catch (error) {
    console.log(error);
    res.json("Error al intentar obtener el producto!");
    return;
  }
});

router.get("/product-added/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    res.render("product-added", { productId, style: "index.css" });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

router.get("/", (req, res) => {
  res.render("login", {
    style: "index.css",
  });
});

router.get("/login", (req, res) => {
  res.render("login", {
    style: "index.css",
  });
});

router.get("/register", (req, res) => {
  res.render("register", {
    style: "index.css",
  });
});
export default router;
