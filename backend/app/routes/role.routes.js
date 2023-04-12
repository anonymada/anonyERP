const { authJwt } = require("../middleware");
const controller = require("../controllers/role.controller");

module.exports = function (app) {
  // get users role
  app.get(
    "/api/roles",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.listRole
  );
};
