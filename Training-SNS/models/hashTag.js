const Sequelize = require('sequelize');

module.exports = class Hashtag extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      title: {
        type: Sequelize.STRING(15),
        allowNull: false,
        unique: true,
      }
    }, {
      sequelize,
      timestamps: true,   //createdAt , updateAt 자동생성
      underscored: true,   // created_At,update_At
      paranoid: true, //delete_At 자동생성
      modelName: 'HashTag',   //User  자바 스크립트에서 쓰는 이름
      tableName: 'HashTags',  //Users 테이블에서 쓰는 이름
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    })
  }
  static associate(db){
    db.Hashtag.belongsToMany(db.Post,{through: 'PostHashtag'})
  }
}