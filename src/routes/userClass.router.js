import RouterClass from "./router.js";

class UserRouter extends RouterClass {
  init() {
    this.get("/", ['ADMIN'], async (req, res) => {
      try {
        // res.send("get users");
        //cortar y pegar las funciones
        res.sendSuccess ('get users')
      } catch (error) {
        res.senServerError('error de server')
      }
    });
  }
}

export default UserRouter;
