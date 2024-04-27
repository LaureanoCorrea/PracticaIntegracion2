import { Router } from "express";
import userManagerMongo from "../dao/Mongo/userManagerMongo.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";
import { generateToken } from "../utils/jsonwebtoken.js";
import { passportCall } from "../middleware/passportCall.js";
import authorization from "../middleware/authentication.middleware.js";
import CartManagerMongo from "../dao/Mongo/cartsManagerMongo.js";

const router = Router();
const sessionService = new userManagerMongo();
const cartService = new CartManagerMongo()

//passport ----------------------------
router.post("/register", async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password)
      return res.status(400).send({ status: "error", error: "Faltan Datos" });

    // Verificar si el usuario ya existe
    const existingUser = await sessionService.getUser({ email });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Crear el nuevo usuario
    const newUser = {
      first_name,
      last_name,
      email,
      password: createHash(password),
    };

    let result = await sessionService.createUser(newUser);

    res.status(201).render("exito", { name: newUser.first_name });
  } catch (error) {
    console.error("Error al registrar usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

router.post("/login", async (req, res) => {
   try {
      const { email, password } = req.body;
      if (!email || !password)
        return res.status(400).send({ status: "error", error: "Faltan Datos" });

      const user = await sessionService.getUser({ email });

      if (!user)
        return res
          .status(401)
          .send({ status: "error", error: "No se encuentra el usuario" });

      // Verificar si el usuario ya tiene un carrito asociado
      if (!user.cart) {
        // Si no tiene un carrito, crea uno nuevo asociado al correo electrónico del usuario
        const newCart = await cartService.create({
          userEmail: user.email,
        }); // Aquí se utiliza user.email en lugar de email

        // Asocia el _id del carrito al usuario
        user.cart = newCart._id;

        // Actualizar el usuario en la base de datos con el _id del carrito
        await sessionService.updateUser(user._id, { cid: newCart._id });
      }

      const isValidPass = isValidPassword(user, password);

      if (!isValidPass)
        return res
          .status(401)
          .send({ status: "error", error: "Usuario o contraseña incorrectos" });

      // generar un token para el usuario
      const { first_name, last_name, role } = user;
      const token = generateToken({
        first_name: user.first_name,
        id: user._id,
        role: user.role,
        cart: user.cart,

        expiresIn: "24h",
      });

      res.cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      });
      res.redirect("/products");
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      res.status(500).send("Error (products) interno del servidor");
    }
  });

router.get("/faillogin", (req, res) => {
  res.send({ status: "error", message: "Login Fails" });
});

router.get("/logout", (req, res) => {
  res.clearCookie("cookieToken");
  res.redirect("/login");
});

// github ----------------------------

router.get(
  "/github",
  passportCall("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passportCall("github", {
    failureRedirect: "/api/sessions/login",
  }),
  async (req, res) => {
    if (!req.user) {
      return res.status(401).send("No autorizado");
    }

    res.redirect("/products");
  }
);

//current ----------------------------

router.get("/current", passportCall('jwt'), authorization(['admin', 'user']), async (req, res) => {
  try {
      if (!req.isAuthenticated()) {
          return res.status(401).send({ status: "error", message: "Usuario no autenticado" });
      }
      const userName = req.user.first_name;
      res.send({ status: "success", message: "Usuario autenticado", user: userName });
  } catch (error) {
      console.error("Error al obtener el nombre de usuario:", error);
      res.status(500).send({ status: "error", message: "Error interno del servidor" });
  }
});


export default router;
