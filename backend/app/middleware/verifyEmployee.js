const db = require("../models");
const Employee = db.employee;

checkDuplicateEmployee = (req, res, next) => {
  Employee.findOne({
    where: { jobServiceNumber: req.body.jobServiceNumber },
  }).then((employee) => {
    if (employee) {
      res.status(400).send({
        message: "Already registered \n IM :" + req.body.jobServiceNumber,
      });
      return;
    }
    next();
  });
};

const verifyEmployee = {
  checkDuplicateEmployee: checkDuplicateEmployee,
};

module.exports = verifyEmployee;
