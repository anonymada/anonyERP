const controller = require("../controllers/employee.controller.js");
const { authJwt, verifyEmployee } = require("../middleware");

module.exports = function (app) {
  // Retrieve all employee
  app.get("/api/employee", [authJwt.verifyToken], controller.listEmployee);

  // Retrieve specified employee
  app.get(
    "/api/employee/details/:id",
    [authJwt.verifyToken],
    controller.viewEmployee
  );

  // Delete specified employee
  app.delete(
    "/api/employee/delete/:id",
    [authJwt.verifyToken],
    controller.deleteEmployee
  );

  // Update specified employee
  app.put(
    "/api/employee/update/:id",
    [authJwt.verifyToken],
    controller.updateEmployee
  );

  // Create employee
  app.post(
    "/api/employee/add",
    [authJwt.verifyToken, verifyEmployee.checkDuplicateEmployee],
    controller.createEmployee
  );
};
