const { authJwt } = require("../middleware");
const controller = require("../controllers/role.controller");

module.exports = function (app) {
  app.get(
    "/api/roles",
    [authJwt.verifyToken, authJwt.isAuthenticatedUser],
    controller.listRole
  );
};
