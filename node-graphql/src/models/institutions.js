'use strict';
module.exports = (sequelize, DataTypes) => {
  const institutions = sequelize.define('institutions', {
    name: DataTypes.STRING
  }, {
    underscored: true,
  });
  institutions.associate = function(models) {
    // associations can be defined here
  };
  return institutions;
};