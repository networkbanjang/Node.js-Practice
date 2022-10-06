const Sequelize = require('sequelize');

module.exports = class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      email: {
        type: Sequelize.STRING(40),
        aloowNull: true,
        unique: true,
      },
      nick: {
        type: Sequelize.STRING(15),
        aloowNull: false,
      },
      password: {
        type: Sequelize.STRING(100),
        aloowNull: true,
      },
      provider: {
        type: Sequelize.STRING(10),
        aloowNull: false,
        defaultValue: 'local',
      },
      snsId: {
        type: Sequelize.STRING(30),
        aloowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,   //createdAt , updateAt 자동생성
      underscored: true,   // created_At,update_At
      paranoid : true , //delete_At 자동생성
      modelName: 'User',   //User  자바 스크립트에서 쓰는 이름
      tableName: 'users',  //Users 테이블에서 쓰는 이름
      charset: 'utf8',
      collate: 'utf8_general_ci',
    }
    )
  }
  static associate(db){
    db.User.hasMany(db.Post);

    db.User.belongsToMany(db.User,{
      foreignKey :'followingId',
      as :'Followers',
      through : 'Follow',
    });
    db.User.belongsToMany(db.User,{
      foreignKey :'followerId',
      as :'Followings',
      through : 'Follow',
    });
  }
}
