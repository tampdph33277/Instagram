var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var i18n = require("i18n");
i18n.configure({
  locales: [
    "af",
    "sq",
    "am",
    "ar",
    "hy",
    "az",
    "eu",
    "be",
    "bn",
    "bs",
    "bg",
    "ca",
    "ceb",
    "zh-CN",
    "zh-TW",
    "co",
    "hr",
    "cs",
    "da",
    "nl",
    "en",
    "eo",
    "et",
    "fi",
    "fr",
    "fy",
    "gl",
    "ka",
    "de",
    "el",
    "gu",
    "ht",
    "ha",
    "haw",
    "iw",
    "hi",
    "hmn",
    "hu",
    "is",
    "ig",
    "id",
    "ga",
    "it",
    "ja",
    "jw",
    "kn",
    "kk",
    "km",
    "ko",
    "ku",
    "ky",
    "lo",
    "la",
    "lv",
    "lt",
    "lb",
    "mk",
    "mg",
    "ms",
    "ml",
    "mt",
    "mi",
    "mr",
    "mn",
    "my",
    "ne",
    "no",
    "ny",
    "ps",
    "fa",
    "pl",
    "pt",
    "pa",
    "ro",
    "ru",
    "sm",
    "gd",
    "sr",
    "st",
    "sn",
    "sd",
    "si",
    "sk",
    "sl",
    "so",
    "es",
    "su",
    "sw",
    "sv",
    "tl",
    "tg",
    "ta",
    "te",
    "th",
    "tr",
    "uk",
    "ur",
    "uz",
    "vi",
    "cy",
    "xh",
    "yi",
    "yo",
    "zu"],
  directory: __dirname + '/language',
  cookie: 'lang',
  header: 'accept-language'
});
const glob = require('glob');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const fs = require("fs");

var app = express();

app.use(i18n.init);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

// catch 404 and forward to error handler
const language_dict = {};
glob.sync('./language/*.json').forEach(function (file) {
  console.log(file);
  let dash = file.split(path.sep);
  if (dash.length === 2) {
    let dot = dash[1].split(".");
    if (dot.length === 2) {
      let lang = dot[0];
      fs.readFile(file, function (err, data) {
        if (err) {
          console.error(err);
          return;
        }
        language_dict[lang] = JSON.parse(data.toString());
      });
    }
  }
});
// viết câu lệnh xử lý khi người dùng truy cập trang chủ
app.get('/',function (req,res) {
  let lang  = 'en';
  i18n.setLocale(req,'en')
  res.render('index', {lang : lang})
})
// viết câu lệnh xử lý khi người dùng truy cập trang có ngôn ngữ cụ thể :
// ví dụ : https://dotsave.app/en
app.get('/:lang',function (req,res,next) {
  // lấy ra địa chỉ truy vấn
  const q = req.url;
  // tách ra language code từ địa chỉ truy vấn
  let dash = q.split("/");
  let lang = undefined
  if (dash.length >= 2) {
    let code = dash[1];
    console.log(language_dict)
    console.log('code = ' + code)
    console.log(language_dict[code])
    if (code !== '' && language_dict.hasOwnProperty(code)) {
      lang = code;
      console.log('AAAA' + lang)
    } else {
      next(createError(404))
      return
    }
  }
  if (lang == undefined) lang = 'en'
  i18n.setLocale(req,lang)
  res.render('index', {lang : lang})
})
// error handler
app.use(function(req, res, next) {
  next(createError(404));
});
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
