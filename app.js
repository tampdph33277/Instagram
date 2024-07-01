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
        "en", "vi", "tr", "id", "fr", "pt", "ru", "es", "ms", "ko", "ja", "jv", "cs", "de", "it", "pl", "hu", "nl", "ro", "el"
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
glob.sync('./language/*.json').forEach(function (file) {
    let dash = file.split("/");
    if (dash.length == 3) {
        let dot = dash[2].split(".");
        if (dot.length == 2) {
            let lang = dot[0];
            fs.readFile(file, function (err, data) {
                if (!err) {
                    language_dict[lang] = JSON.parse(data.toString());
                }
            });
        }
    }
});

app.get('/', function (req, res) {
    let lang = req.cookies.lang || 'en';
    i18n.setLocale(req, lang);
    res.render('index', { lang: lang });
});

app.get('/:lang', function (req, res, next) {
    let lang = req.params.lang;
    if (i18n.getLocales().includes(lang)) {
        res.cookie('lang', lang);
        i18n.setLocale(req, lang);
        res.render('index', { lang: lang });
    } else {
        next(createError(404));
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post("/download", async (req, res) => {
    const url = req.body.url;
    const lang = req.body.lang || 'en';

    // Thiết lập ngôn ngữ
    i18n.setLocale(req, lang);

    if (!url) {
        res.status(400).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
        return;
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
        console.log(response.data);

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
                // Lấy link video từ video_versions
                if (item.video_versions && Array.isArray(item.video_versions)) {
                    video_stos = item.video_versions.map(video => video.url);
                    console.log("Video URLs from video_versions:", video_stos);
                }
                // Lấy link ảnh từ image_versions2
                if (item.image_versions2 && item.image_versions2.candidates) {
                    picture_stos = item.image_versions2.candidates.map(candidate => candidate.url);
                    console.log("Picture URLs from image_versions2:", picture_stos);
                }
                mediaData.push({
                    video_stos: video_stos,
                    picture_stos: picture_stos
                });
            });
        }
        res.status(200).render('downloader', { mediaData: mediaData, lang: lang });
        console.log('Media Data:', mediaData);
    } catch (error) {
        console.log("Error:", error.message);
        res.status(500).render('index', { error: "An error occurred while processing your request.", lang: lang });
    }
});

app.use(function (req, res, next) {
    next(createError(404));
});

app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
