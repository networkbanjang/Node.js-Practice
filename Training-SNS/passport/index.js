const passport = require('passport');
const local = require('./localStrategy');
const kakao = require('./kakaoStrategy');
const User = require('../models/user');

module.exports = () => {
  passport.serializeUser((user, done) => {
    done(null, user.id)  //세션에 유저의 id만 저장
  });

  passport.deserializeUser((id, done) => {
    User.findOne({ where: { id } 
    ,
    include: [{
      model : User,
      attributes : ['id','nick'],
      as : 'Followers',
    },
    {
      model : User,
      attributes : ['id','nick'],
      as : 'Followings',
    }
  
  ],
  })
      .then(user => done(null, user))   //req.user  :로그인한 사용자의 정보
      .catch(err => done(err));   //req.isAuthenticated : 로그인되어있으면 트루
  });

  local();
  kakao();
};
