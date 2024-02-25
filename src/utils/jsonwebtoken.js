import jwt from "jsonwebtoken";

export const private_key = "myPrivateKey";

export const generateToken = (user) =>{
 const token = jwt.sign({user}, private_key, { expiresIn: "24h" })
return token;
}

export const authTokenMiddleware = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).send("Unauthorized request");
  const token = authHeader.split(" ")[1]; //Bearer <token>

  jwt.verify(token, private_key, (err, decodeUser) => {
    if (err) {
      return res.status(401).send("Unauthorized request");
    }
    req.user = decodeUser;
    next();
  });
};

