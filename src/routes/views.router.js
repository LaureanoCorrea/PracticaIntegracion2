import { Router } from "express";
import ProductManagerMongo from "../dao/Mongo/productsManagerMongo.js";
import CartManagerMongo from "../dao/Mongo/cartsManagerMongo.js";

const router = Router();

router.param("parametro", async (req, res, next, parametro) => {
  req.parametro = parametro;
  next();
});

router.get("/products", async (req, res) => {
  const { limit = 10, page = 1, sort = "", query = "" } = req.query;

  try {
    const options = {
      limit,
      page,
      sort: sort || {},
      query,
    };

    const result = await ProductManagerMongo.getProductsPaginated(options);

    const {
      docs: products,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page: currentPage,
    } = result;
	
    const username = req.user.name;
    const role = req.user.role;

    res.render("products", {
      username,
      role,
      products,
      hasPrevPage,
      hasNextPage,
      prevPage,
      nextPage,
      page: currentPage,
      style: "index.css"
    });

} catch (error) {
	console.error(error);
    res.status(500).send("Error interno del servidor");
}
});

router.get("/chat", (req, res) => {
  res.render("chat", {
    style: "index.css",
  });
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await ProductManagerMongo.find({});
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

router.get("/productDetails/:pid", async (req, res) => {
  const { pid } = req.params;
  try {
    const product = await ProductManagerMongo.findById(pid).lean();
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

router.get("/carts/:cid", async (req, res) => {
  try {
    const cid = "65c2865ee7d8464e663be2b9";

    const cart = await CartManagerMongo.getCart({ _id: cid });
    const products = await ProductManagerMongo.getProducts({});
    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "El carrito especificado no existe",
      });
    }

    res.render("cart", {
      cart: products,
      style: "index.css",
    });
    console.log("updated", products);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      message: "Error interno del servidor",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const products = await ProductManagerMongo.find({});
    res.render("realTimeProducts", {
      productos: products,
      style: "index.css",
    });
  } catch (error) {
    console.log(error);
    res.render("Error al intentar obtener la lista de productos!");
    return;
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
