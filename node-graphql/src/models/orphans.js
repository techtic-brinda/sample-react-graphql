'use strict';
module.exports = (sequelize, DataTypes) => {
  const orphans = sequelize.define('orphans', {
    name: DataTypes.STRING
  }, {
    underscored: true,
  });
  orphans.associate = function(models) {
    // associations can be defined here
  };
  return orphans;
};