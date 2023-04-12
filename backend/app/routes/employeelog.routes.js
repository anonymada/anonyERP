const controller = require("../controllers/employeelog.controller.js");
const { authJwt } = require("../middleware");

module.exports = function (app) {
  // Retrieve all employeelog
  app.get("/api/employeelog", [authJwt.verifyToken], controller.listLog);

  // Create employeelog
  app.post(
    "/api/employeelog/add",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.createLog
  );

  // Update employeelog
  app.post(
    "/api/employeelog/update",
    [authJwt.verifyToken, authJwt.isModeratorOrAdmin],
    controller.updateLog
  );

  // retrieve one employeelog
  app.post("/api/employeelog/view", controller.viewLog);

  // delete all log
  app.delete(
    "/api/employeelog/deleteall",
    [authJwt.verifyToken, authJwt.isAdmin],
    controller.deleteAllLog
  );
};
