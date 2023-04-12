const { authJwt } = require("../middleware");
const controller = require("../controllers/user.controller");

module.exports = function (app) {
  // get users list
  app.get(
    "/api/users",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.listUser
  );

  app.get(
    "/api/users/details/:id",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.viewUser
  );

  // delete user
  app.delete(
    "/api/users/delete/:id",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteUser
  );

  // update user as user
  app.patch(
    "/api/users/update/:id",
    // [authJwt.verifyToken],
    controller.updateUser
  );

  // update user as admin can change role
  app.patch(
    "/api/users/updaterole/:id",
    // [authJwt.verifyToken, authJwt.isAdmin],
    controller.updateRoles
  );
};
