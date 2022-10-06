const express = require('express');
const { Post, User, Hashtag } = require('../models');
const router = express.Router();

router.use((req, res, next) => {
  res.locals.user = req.user;                  //전역변수, 모든 렌더에 res.user = req.user; 가 됨
  res.locals.followerCount = req.user ? req.user.Followers.length : 0;
  res.locals.followingCount = req.user ? req.user.Followings.length : 0;
  res.locals.followerIdList = req.user ? req.user.Followings.map(f => f.id) : [];
  next();
});

router.get('/profile', (req, res) => {
  res.render('profile', { title: '내 정보 -NodeBird' });
})
router.get('/join', (req, res) => {
  res.render('join', { title: '회원가입 -NodeBird' });
});
router.get('/', async (req, res, next) => {
try{
  const posts = await Post.findAll({
    include: {
      model:User,
      attributes: ['id','nick'],
    },
    order :[['createdAt','Desc']],
  });
  res.render('main',{
    title:'NodeBird',
    twits:posts,
  });
}catch(err){
  console.error(err);
  next(err);
}
});

router.get('/hashtag', async(req,res,next)=>{
  const query = req.query.hashtag;    //?뒤에 오는것
  if(!query){
    return res.redirect('/');
  }try{
    const hashtag = await Hashtag.findOne({where: {title:query}});
    let posts = [];
    if(hashtag){
      posts = await hashtag.getPosts({include:[{model:User,attributes:['id','nick']}]});
    }
    return res.render('main',{
      title:`${query} 검색결과`,
      twits : posts
    })
  }catch(error){
    console.error(error);
    next(error);
  }
})
module.exports = router;