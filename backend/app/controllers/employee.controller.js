const db = require("../models");
const employee = db.employee;

// add new employee
exports.createEmployee = (req, res) => {
  const emp = {
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    nationalIdentityNumber: req.body.nationalIdentityNumber,
    dateOfNin: req.body.dateOfNin,
    cityOfNin: req.body.cityOfNin,
    dateOfNinDuplicata: req.body.dateOfNinDuplicata,
    cityOfNinDuplicata: req.body.cityOfNinDuplicata,
    gender: req.body.gender,
    maritalStatus: req.body.maritalStatus,
    childInCharge: req.body.childInCharge,
    dateOfBirth: req.body.dateOfBirth,
    cityOfBirth: req.body.cityOfBirth,
    address: req.body.address,
    city: req.body.city,
    phone: req.body.phone,
    mobile: req.body.mobile,
    email: req.body.email,
    photo: req.body.photo,
    jobServiceNumber: req.body.jobServiceNumber,
    jobIndex: req.body.jobIndex,
    jobTitle: req.body.jobTitle,
    jobContract: req.body.jobContract,
    jobQuality: req.body.jobQuality,
    jobCategory: req.body.jobCategory,
    jobFrame: req.body.jobFrame,
    jobHonours: req.body.jobHonours,
    jobHireDate: req.body.jobHireDate,
    jobLastContractDate: req.body.jobLastContractDate,
    jobLastAmandmentDate: req.body.jobLastAmandmentDate,
    jobMission: req.body.jobMission,
    jobAttribution: req.body.jobAttribution,
    jobScale: req.body.jobScale,
    jobClass: req.body.jobClass,
    jobDepartment: req.body.jobDepartment,
  };
  employee
    .create(emp)
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Data not registered \n" + err,
      });
    });
};

// list all employees
exports.listEmployee = (req, res) => {
  employee
    .findAll()
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      res.status(500).send({
        message: "Data not retrieved \n" + err,
      });
    });
};

// Update employee by ID
exports.updateEmployee = (req, res) => {
  const id = req.params.id;
  employee
    .update(req.body, { where: { id: id } })
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
};

// delete employee by ID
exports.deleteEmployee = (req, res) => {
  const id = req.params.id;
  employee
    .destroy({
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

//view employee by ID
exports.viewEmployee = (req, res) => {
  const id = req.params.id;
  employee
    .findByPk(id)
    .then((data) => {
      if (data) {
        res.status(200).send(data);
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
