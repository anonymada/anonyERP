module.exports = (sequelize, Sequelize) => {
  var moment = require("moment");
  moment.suppressDeprecationWarnings = true;

  const Role = sequelize.define("employeeLog", {
    id: {
      type: Sequelize.UUID,
      defaultValue: Sequelize.UUIDV1,
      primaryKey: true,
    },
    dateOfLog: {
      type: Sequelize.DATEONLY,
      get: function () {
        return this.getDataValue("dateOfLog")
          ? moment(this.getDataValue("dateOfLog")).format("YYYY-MM-DD")
          : null;
      },
    },
    hourAmIn: {
      type: Sequelize.TIME,
    },
    hourAmOut: {
      type: Sequelize.TIME,
    },
    hourPmIn: {
      type: Sequelize.TIME,
    },
    hourPmOut: {
      type: Sequelize.TIME,
    },
  });

  return Role;
};
