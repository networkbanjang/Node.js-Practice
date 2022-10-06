const express = require('express');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
dotenv.config();  //dotenv의 설정값을 가져온다

const pageRouter = require('./routes/page');
const authRouter = require('./routes/auth');
const postRouter = require('./routes/post');
const userRouter = require('./routes/user');

const { sequelize } = require('./models')
const passport = require('passport');
const passportConfig = require('./passport')

const app = express();
app.set('port', process.env.PORT || 8001);   // 포트설정
app.set('view engine', 'html')   //뷰 엔진을 html로 바꾼다
nunjucks.configure('views', {        //넌적스, views폴더를 path로 씀
  express: app,
  watch: true,
});
passportConfig();

sequelize.sync({ force: false })             // 데이터베이스 싱크 같게하는것
  .then(() => {
    console.log("데이터 베이스 연결 성공");
  })
  .catch((err) => {
    console.error(err);
  });

;

app.use(morgan('dev'));  //서버 변화할때마다 개발자용으로 로그띄우기
app.use(express.static(path.join(__dirname, 'public')));  // 고정경로 설정 디렉토리이름/퍼블릭폴더x
app.use('/img',express.static(path.join(__dirname, 'uploads')));  
app.use(express.json())  //json 읽기
app.use(express.urlencoded({ extended: true }));  // 파일 업로드하는것 읽기용 
app.use(cookieParser(process.env.COOKIE_SECRET)) //쿠키사용, 서명은  환경변수에있는 쿠키_시크릿
app.use(session({                           //세션 사용
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET,
  cookie: {
    httpOnly: true,
    secure: false,
  },
}));

app.use(passport.initialize());         //express-session의 아래
app.use(passport.session());

app.use('/', pageRouter);  // 페이지 라우팅용,
app.use('/auth', authRouter);  // 회원가입 라우팅용,
app.use('/post',postRouter) ;//게시글 라우팅용
app.use('/user',userRouter);

app.use((req, res, next) => {              //404 에러, 페이지없음
  const error = new Error(`${req.method} ${req.url} 페이지가 없습니다.`);
  error.status = 404;
  next(error);
});

app.use((err, req, res, next) => {              //에러 처리, 맨 아래있어야함
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV !== 'production' ? err : {};  //개발모드일땐 에러스택 넣어주기
  res.status(err.status || 500).render('error');    // err status가 없으면 500으로 반환 ,views에 있는 error.html로 렌더
});

app.listen(app.get('port'), () => {
  console.log(app.get('port'), '번 포트에서 대기중');
});