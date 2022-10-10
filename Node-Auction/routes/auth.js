const express = require('express');
const passport = require('passport');
const bcrypt = require('bcrypt');

const { isLoggedIn, isNotLoggedIn } = require('./middlewares');
const User = require('../models/user')

const router = express.Router();

router.post('/join', isNotLoggedIn, async (req, res, next) => {
  const { email, nick, password, money } = req.body;
  try {
    const exUser = await User.findOne({ where: { email } });
    if (exUser) {
      return res.redirect('/join?joinError=이미 가입된 이메일입니다.');
    }
    const hash = await bcrypt.hash(password, 12);
    console.log(" 왜안됨!",hash);
    await User.create({
      email,
      nick,
      password: hash,
      money,
    }) 
    return res.redirect('/');
  } catch (error) {
    console.error(error);
    return next(error);
  }
})

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (authError, user, info) => {
    if (authError) {
      console.error(authError);
      return next(authError);
    }
    if (!user) {
      return res.redirect(`/?loginError=${info.message}`);
    }
    return req.logIn(user, logginError => {
      if (logginError) {
        console.error(logginError);
        return next(logginError);
      }
      return res.redirect('/');
    });
  })(req,res,next);
})

router.get('/logout',isLoggedIn,(req,res)=>{
  req.logOut();
  req.session.destroy();
  res.redirect('/');
});

module.exports=router;