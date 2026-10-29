const db = require("../models");
const Role = db.role;

// list all role
exports.listRole = (req, res) => {
  Role.findAll()
    .then((roles) => {
      res.status(200).send(roles);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};
