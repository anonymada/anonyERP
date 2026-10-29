const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  app.get(
    "/api/users",
    [authJwt.verifyToken, authJwt.isAuthenticatedUser],
    controller.listUser
  );

  app.get(
    "/api/users/details/:id",
    [authJwt.verifyToken, authJwt.isAuthenticatedUser],
    controller.viewUser
  );

  app.delete(
    "/api/users/delete/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.deleteUser
  );

  app.patch(
    "/api/users/update/:id",
    [authJwt.verifyToken, authJwt.canModifyUser, authJwt.preventRoleChange],
    controller.updateUser
  );

  app.patch(
    "/api/users/updaterole/:id",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateRoles
  );
};
