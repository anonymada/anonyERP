const db = require("../models");
const User = db.user;

const checkDuplicateUsernameOrEmail = (req, res, next) => {
  User.findOne({ where: { username: req.body.username } }).then((user) => {
    if (user) {
      return res.status(400).send({ message: "Failed! Username is already in use!" });
    }

    User.findOne({ where: { email: req.body.email } }).then((user) => {
      if (user) {
        return res.status(400).send({ message: "Failed! Email is already in use!" });
      }
      next();
    });
  });
};

const checkRolesExisted = (req, res, next) => {
  if (req.body.roles !== undefined || req.body.role !== undefined || req.body.roleId !== undefined) {
    return res.status(403).send({
      message: "Public signup cannot assign roles. Only the user role is assigned.",
    });
  }
  next();
};

module.exports = { checkDuplicateUsernameOrEmail, checkRolesExisted };
