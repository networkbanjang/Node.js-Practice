const express = require('express')
const multer = require('multer');
const router = express.Router();
const path = require('path');
const fs = require('fs');

const { Post, Hashtag } = require('../models');

const { isLoggedIn } = require('./middlewares')

try {
  fs.readdirSync('uploads');
} catch (err) {
  console.error('uploads 폴더가없어 upload를 생성합니다.');
  fs.mkdirSync('uploads');
}

const upload = multer({
  storage: multer.diskStorage({           //diskStorage = 디스크에 저장
    destination(req, file, cb) {
      cb(null, 'uploads/');              //파일 경로
    },
    filename(req, file, cb) {
      const ext = path.extname(file.originalname);         //확장자 추출
      cb(null, path.basename(file.originalname, ext) + Date.now + ext);
    },
  }),
  limits: { fileSize: 5 * 1024 * 1024 },         //최대사이즈 설정
});

router.post('/img', isLoggedIn, upload.single('img'), (req, res) => {         //single 한개만 업로드 ('img') 는 아이디 찾아감 
  console.log(req.file);
  res.json({ url: `/img/${req.file.filename}` });
});

router.post('/', isLoggedIn, upload.none(), async (req, res, next) => {
  try {
    const post = await Post.create({
      UserId: req.user.id,
      content: req.body.content,
      img: req.body.url,
    });
    const hashtags = req.body.content.match(/#[^\s#]*/g);
    if (hashtags) {
      const result = await Promise.all(
        hashtags.map(tag => {
          return Hashtag.findOrCreate({
            where: { title: tag.slice(1).toLowerCase() },
          })
        }),
      );
      console.log("경계선 --------------------------------------------------------------------------------------")
      await post.addHashTags(result.map(r => r[0]));
    }
    res.redirect('/');
  } catch (error) {
    console.error(error)
    next(error)

  }

})

module.exports = router;