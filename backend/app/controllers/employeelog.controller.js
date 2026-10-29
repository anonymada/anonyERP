const db = require("../models");
const employeelog = db.employeelog;

// add new log
exports.createLog = (req, res) => {
  const log = {
    dateOfLog: req.body.dateOfLog,
    employeeId: req.body.employeeId,
    hourAmIn: req.body.hourAmIn,
    hourAmOut: req.body.hourAmOut,
    hourPmIn: req.body.hourPmIn,
    hourPmOut: req.body.hourPmOut,
  };
  employeelog
    .findOrCreate({
      where: {
        dateOfLog: req.body.dateOfLog,
        employeeId: req.body.employeeId,
      },
      defaults: log,
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "data not registered " + err,
      });
    });
};

// list all log
exports.listLog = (req, res) => {
  employeelog
    .findAll()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Data not retrieved \n " + err,
      });
    });
};

//delete all log
exports.deleteAllLog = () => {
  employeelog.destroy({
    where: {},
    truncate: true,
  });
};

//view log
exports.viewLog = (req, res) => {
  employeelog
    .findAll({
      where: {
        dateOfLog: req.body.dateOfLog,
        employeeId: req.body.employeeId,
      },
    })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Data not retrieved .\n" + err,
      });
    });
};

//update log
exports.updateLog = (req, res) => {
  employeelog
    .update(
      {
        hourAmIn: req.body.hourAmIn,
        hourAmOut: req.body.hourAmOut,
        hourPmIn: req.body.hourPmIn,
        hourPmOut: req.body.hourPmOut,
      },
      {
        where: {
          dateOfLog: req.body.dateOfLog,
          employeeId: req.body.employeeId,
        },
      }
    )
    .then((data) => {
      if (data == 1) {
        res.status(200).send(data);
      } else {
        res.status(400).send({
          message: "Data not registered \n Verify your request",
        });
      }
    })
    .catch((err) => {
      res.status(500).send({
        message: "Data not registered " + err,
      });
    });
};
