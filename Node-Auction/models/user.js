const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        allowNull: false,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        allowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      money: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    }, {
      sequelize, //ID 넣어주기
      underscored: true,   // created_At,update_At
      timestamps: true,  //createdAt , updateAt
      paranoid: true, //deleteAt
      modelName: 'User', //User  자바 스크립트에서 쓰는 이름
      tableName: 'users', //Users 테이블에서 쓰는 이름
      charset: 'utf8',
      collate: 'utf8_general_ci',
    });
  }

  static associate(db) {
    db.User.hasMany(db.Auction);
  }
};


