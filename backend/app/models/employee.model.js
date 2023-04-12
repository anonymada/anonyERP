module.exports = (sequelize, Sequelize) => {
  var moment = require("moment");
  moment.suppressDeprecationWarnings = true;

  const Employee = sequelize.define("employees", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    firstname: {
      type: Sequelize.STRING,
      get: function () {
        if (this.getDataValue("firstname") !== null) {
          var separateWord = this.getDataValue("firstname")
            .toLowerCase()
            .split(" ");
          for (var i = 0; i < separateWord.length; i++) {
            separateWord[i] =
              separateWord[i].charAt(0).toUpperCase() +
              separateWord[i].substring(1);
          }
          return separateWord.join(" ");
        } else {
          return null;
        }
      },
    },
    lastname: {
      type: Sequelize.STRING,
      get: function () {
        return this.getDataValue("lastname")
          ? this.getDataValue("lastname").toUpperCase()
          : null;
      },
    },
    nationalIdentityNumber: {
      type: Sequelize.STRING,
    },
    dateOfNin: {
      type: Sequelize.DATEONLY,
      get: function () {
        return this.getDataValue("dateOfNin")
          ? moment.utc(this.getDataValue("dateOfNin")).format("YYYY-MM-DD")
          : null;
      },
    },
    cityOfNin: {
      type: Sequelize.STRING,
    },
    dateOfNinDuplicata: {
      type: Sequelize.DATEONLY,
      get: function () {
        return this.getDataValue("dateOfNinDuplicata")
          ? moment
              .utc(this.getDataValue("dateOfNinDuplicata"))
              .format("YYYY-MM-DD")
          : null;
      },
    },
    cityOfNinDuplicata: {
      type: Sequelize.STRING,
    },
    gender: {
      type: Sequelize.STRING,
    },
    maritalStatus: {
      type: Sequelize.STRING,
    },
    childInCharge: {
      type: Sequelize.INTEGER,
    },
    dateOfBirth: {
      type: Sequelize.DATEONLY,
      get: function () {
        return this.getDataValue("dateOfBirth")
          ? moment(this.getDataValue("dateOfBirth")).format("YYYY-MM-DD")
          : null;
      },
    },
    cityOfBirth: {
      type: Sequelize.STRING,
    },
    address: {
      type: Sequelize.STRING,
    },
    city: {
      type: Sequelize.STRING,
    },
    phone: {
      type: Sequelize.STRING,
    },
    mobile: {
      type: Sequelize.STRING,
    },
    email: {
      type: Sequelize.STRING,
    },
    photo: {
      type: Sequelize.STRING,
    },
    jobServiceNumber: {
      type: Sequelize.STRING,
    },
    jobIndex: {
      type: Sequelize.STRING,
    },
    jobTitle: {
      type: Sequelize.STRING,
      get: function () {
        return this.getDataValue("jobTitle")
          ? this.getDataValue("jobTitle").toUpperCase()
          : null;
      },
    },
    jobContract: {
      type: Sequelize.STRING,
    },
    jobDepartment: {
      type: Sequelize.STRING,
      get: function () {
        return this.getDataValue("jobDepartment")
          ? this.getDataValue("jobDepartment").toUpperCase()
          : null;
      },
    },
    jobQuality: {
      type: Sequelize.STRING,
      get: function () {
        return this.getDataValue("jobQuality")
          ? this.getDataValue("jobQuality").toUpperCase()
          : null;
      },
    },
    jobCategory: {
      type: Sequelize.STRING,
    },
    jobFrame: {
      type: Sequelize.STRING,
    },
    jobHonours: {
      type: Sequelize.STRING,
    },
    jobHireDate: {
      type: Sequelize.DATEONLY,
      get: function () {
        return this.getDataValue("jobHireDate")
          ? moment(this.getDataValue("jobHireDate")).format("YYYY-MM-DD")
          : null;
      },
    },
    jobLastContractDate: {
      type: Sequelize.DATEONLY,
      get: function () {
        return this.getDataValue("jobLastContractDate")
          ? moment(this.getDataValue("jobLastContractDate")).format(
              "YYYY-MM-DD"
            )
          : null;
      },
    },
    jobLastAmandmentDate: {
      type: Sequelize.DATEONLY,
      get: function () {
        return this.getDataValue("jobLastAmandmentDate")
          ? moment(this.getDataValue("jobLastAmandmentDate")).format(
              "YYYY-MM-DD"
            )
          : null;
      },
    },
    jobScale: {
      type: Sequelize.STRING,
    },
    jobClass: {
      type: Sequelize.STRING,
    },
    jobMission: {
      type: Sequelize.STRING,
    },
    jobAttribution: {
      type: Sequelize.STRING,
    },
  });

  return Employee;
};
