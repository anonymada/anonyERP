const db = require("../models");
const User = db.user;
const Role = db.role;
const Op = db.Sequelize.Op; //~~operateur
var bcrypt = require("bcryptjs");

// list all user
exports.listUser = (req, res) => {
  User.findAll()
    .then((users) => {
      res.status(200).send(users);
    })
    .catch((err) => {
      res.status(500).send({
        message: err.message,
      });
    });
};

//view user
exports.viewUser = (req, res) => {
  const id = req.params.id;
  User.findByPk(id)
    .then((data) => {
      if (data) {
        var authorities = [];
        data.getRoles().then((roles) => {
          for (let i = 0; i < roles.length; i++) {
            authorities.push(roles[i].id);
          }
          res.status(200).send({
            id: data.id,
            username: data.username,
            email: data.email,
            roles: authorities,
          });
        });
      } else {
        res.status(404).send({
          message: "Data not retrieved \n Verify your request",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Data not retrieved \n" + err,
      });
    });
};

// Update user roles only for admin
exports.updateRoles = (req, res) => {
  const id = req.params.id;
  User.update(req.body, { where: { id: id } })
    .then((num) => {
      if (num == 1) {
        if (req.body.roles) {
          var roles = req.body.roles;
          User.findByPk(id).then((user) => {
            user
              .setRoles(roles)
              .then((user) => {
                res.status(200).send({ message: "Data registerd" });
              })
              .catch((err) => {
                res.status(400).send({
                  message: "Data not registered \n " + err,
                });
              });
          });
        }
      } else {
        res.status(400).send({
          message: "Data not registered \n Verify your request",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Data not registered \n" + err,
      });
    });
};

// Update by user
exports.updateUser = (req, res) => {
  const id = req.params.id;
  if (req.body.password) {
    User.findByPk(id).then((user) => {
      if (req.body.oldPassword) {
        bcrypt.compare(
          req.body.oldPassword,
          user.password,
          function (err, result) {
            if (err) {
              res.status(500).send({
                message: "Data not registered \n" + err,
              });
            }
            if (result) {
              User.update(
                {
                  username: req.body.username,
                  email: req.body.email,
                  password: bcrypt.hashSync(req.body.password, 8),
                },
                { where: { id: id } }
              )
                .then((num) => {
                  if (num == 1) {
                    res.status(200).send({
                      message: "Data registered",
                    });
                  } else {
                    res.status(400).send({
                      message: "Data not registered \n Verify your request",
                    });
                  }
                })
                .catch((err) => {
                  res.status(500).send({
                    message: "Data not registered \n" + err,
                  });
                });
            } else {
              res.status(400).send({
                message: "Data not registered \n Current Password not matched",
              });
            }
          }
        );
      }
    });
  }
};

// delete user by ID
exports.deleteUser = (req, res) => {
  const id = req.params.id;
  User.destroy({
    where: { id: id },
  })
    .then((num) => {
      if (num == 1) {
        res.status(200).send({ message: "Data deleted" });
      } else {
        res.status(400).send({
          message: "Data not deleted \n Verify your request",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Data not deleted \n" + err,
      });
    });
};
