var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
var logger = require('morgan');
var i18n = require("i18n");
const glob = require('glob');

i18n.configure({
    locales: [
        "en",
        "vi",
        "tr",
        "id",
        "fr",
        "pt",
        "ru",
        "es",
        "ms",
        "ko",
        "ja",
        "jv",
        "cs",
        "de",
        "it",
        "pl",
        "hu",
        "nl",
        "ro",
        "el",
    ],
    directory: __dirname + '/language',
    cookie: 'lang',
    header: 'accept-language'
});

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

app.use(i18n.init);
app.use(express.static('public'));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

const language_dict = {};
// Sử dụng Promise.all để đợi cho tất cả các lời hứa được giải quyết trước khi tiếp tục
glob.sync('./language/*.json').forEach(function (file) {
    console.log(file)
    let dash = file.split("/");
    if (dash.length == 3) {
        let dot = dash[2].split(".");
        if (dot.length == 2) {
            let lang = dot[0];
            fs.readFile(file, function (err, data) {
                language_dict[lang] = JSON.parse(data.toString());
            });
        }
    }
});

// viết câu lệnh xử lý khi người dùng truy cập trang chủ
app.get('/', function (req, res) {
    let lang = req.cookies.lang || 'en'; // Lấy ngôn ngữ từ cookie hoặc mặc định là 'en'
    i18n.setLocale(req, lang);
    res.render('index', { lang: lang, error: null });
});

// viết câu lệnh xử lý khi người dùng truy cập trang có ngôn ngữ cụ thể :
app.get('/:lang', function (req, res, next) {
    // lấy ra địa chỉ truy vấn
    const lang = req.params.lang;
    if (language_dict.hasOwnProperty(lang)) {
        res.cookie('lang', lang, { maxAge: 900000, httpOnly: true }); // Lưu ngôn ngữ vào cookie
        i18n.setLocale(req, lang);
        res.render('index', { lang: lang, error: null });
    } else {
        next(createError(404));
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/download", async (req, res) => {
    const url = req.body.url;
    let lang = req.body.lang || req.cookies.lang || 'en'; // Ưu tiên lấy từ body sau đó từ cookie, nếu không có thì mặc định là 'en'

    if (!url) {
        return res.status(200).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
    }

    const options = {
        method: 'POST',
        url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
        headers: {
            'content-type': 'application/json',
            'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
            'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
        },
        data: {
            url: url
        }
    };

    try {
        const response = await axios.request(options);
        let mediaData = [];

        if (response.data && response.data.length > 0) {
            response.data.forEach(item => {
                let mediaItem = {
                    pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
                    videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
                    picture: item.pictureUrl,
                };
                mediaData.push(mediaItem);
            });
        }

        if (response.data && response.data.result && response.data.result.length > 0) {
            response.data.result.forEach(item => {
                let video_stos = [];
                let picture_stos = [];

                if (item.video_versions && Array.isArray(item.video_versions)) {
                    video_stos = item.video_versions.map(video => video.url);
                }

                if (item.image_versions2 && item.image_versions2.candidates) {
                    picture_stos = item.image_versions2.candidates.map(candidate => candidate.url);
                }

                mediaData.push({
                    video_stos: video_stos,
                    picture_stos: picture_stos
                });
            });
        }

        res.status(200).render('downloader', { mediaData: mediaData, lang: lang });
    } catch (error) {

    }
});


// error handler
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
