const controller = require("../controllers/employee.controller.js");
const { authJwt, verifyEmployee } = require("../middleware");

module.exports = function (app) {
  app.get("/api/employee", [authJwt.verifyToken, authJwt.isAuthenticatedUser], controller.listEmployee);

  app.get(
    "/api/employee/details/:id",
    [authJwt.verifyToken, authJwt.isAuthenticatedUser],
    controller.viewEmployee
  );

  app.delete(
    "/api/employee/delete/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.deleteEmployee
  );

  app.put(
    "/api/employee/update/:id",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.updateEmployee
  );

  app.post(
    "/api/employee/add",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin, verifyEmployee.checkDuplicateEmployee],
    controller.createEmployee
  );
};
