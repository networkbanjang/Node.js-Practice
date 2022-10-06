const Sequelize = require('sequelize');

module.exports = class Post extends Sequelize.Model {
  static init(sequelize) {
    return super.init({
      content: {
        type: Sequelize.STRING(140),
        aloowNull: false,
      },
      img: {
        type: Sequelize.STRING(200),
        aloowNull: true,
      },
    }, {
      sequelize,
      timestamps: true,   //createdAt , updateAt 자동생성
      underscored: true,   // created_At,update_At
      paranoid : false , //delete_At 자동생성 안함
      modelName: 'Post',   //User  자바 스크립트에서 쓰는 이름
      tableName: 'posts',  //Users 테이블에서 쓰는 이름
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci',
    }
    )
  }
  static associate(db){
    db.Post.belongsTo(db.User);
    db.Post.belongsToMany(db.Hashtag,{through: 'PostHashtag'})
  }
}