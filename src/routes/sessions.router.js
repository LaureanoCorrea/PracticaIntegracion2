import { Router } from "express";
import auth from "../middleware/authentication.middleware.js";
import userManagerMongo from "../dao/Mongo/userManagerMongo.js";
import passport from "passport";
import { passportCall } from "../middleware/passportCall.js";
import { authorization } from "../middleware/authorization.middleware.js";
import { generateToken, authTokenMiddleware } from "../utils/jsonwebtoken.js";
import { createHash, isValidPassword } from "../utils/hashBcrypt.js";

const router = Router();
const sessionService = new userManagerMongo();

// token --------------------

router.post("/register", async (req, res) => {
  try {
    const { name, last_name, email, password } = req.body;
    const exists = sessionService.getUsers((user) => user.email === email);
    if (exists)
      return res
        .status(400)
        .send({ status: "error", error: "User Already Exist" });
    if (email == "" || password == "")
      return res.send("Faltan Campos obligatorios");

    const newUser = {
      name,
      last_name,
      email,
      password: createHash(password),
    };
    console.log("sessions", password);

    const result = await sessionService.createUsers(newUser);

    const token = generateToken({
      id: result._id,
    });
    res
      .status(200)
      .cookie("cookieToken", token, {
        maxAge: 60 * 60 * 1000 * 24,
        httpOnly: true,
      })
      .send({
        status: "success",
        usersCreate: result,
        token,
      });
    console.log(token);

    // res.redirect('/login');
  } catch (error) {
    res.send({ status: "error", error: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await sessionService.getUserBy({ email });

  if (!user) return res.status(401).json({ error: "User invalid" });

  if (!isValidPassword(password, user.password))
    return res.status(401).send("no coincide las credenciales");

  console.log("Email session:", email, "Password:", password);
  // const role = req.session.user ? req.session.user.role : undefined;

  // req.session.user = {
  //   id: user._id,
  //   username: user.first_name,
  //   role: role,
  // };

  const token = generateToken({
    fullname: `${user.name} ${user.last_name}`,
    id: user._id,
    role: user.role,
    email: user.email,
  });

  res
    .status(200)
    .cookie("cookieToken", token, {
      maxAge: 60 * 60 * 1000 * 24,
      httpOnly: true,
    })

    .redirect("/products");

  // res.redirect('/products');
});

router.get(
  "/current",
  passportCall("jwt"),
  authorization("user"),
  async (req, res) => {
    res.send("<h1>datos sensibles</h1>");
  }
);

// github ----------------------------

router.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] }),
  async (req, res) => {}
);

router.get(
  "/githubcallback",
  passport.authenticate("github", { failureRedirect: "/api/sessions/login" }),
  async (req, res) => {
    req.session.user = req.user;
    res.redirect("/products");
  }
);

router.get("/logout", (req, res) => {
  req.session.destroy((error) => {
    if (error) return res.send("Logout Error");
    res.redirect("/login");
  });
});

export default router;
