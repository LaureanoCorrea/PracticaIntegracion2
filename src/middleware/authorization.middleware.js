 import passport from "passport";

export const authorization = (role) => {
  return async (req, res, next) => {
    if (!req.user)
      return res
        .status(401)
        .json({ status: "error", error: "Unauthorized request" });
    if (req.user.role !== role)
      return res
        .status(401)
        .json({ status: "error", error: "Unauthorized request Role" });
        next();
  };
};
