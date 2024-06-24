const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
const logger = require('morgan');
const i18n = require("i18n");

i18n.configure({
    locales: [
        "ja",
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

const glob = require('glob');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(i18n.init);
app.use(express.static('public'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/users', usersRouter);

const language_dict = {};

glob.sync('../language/*.json').forEach(function (file) {
    const dash = file.split("/");
    if (dash.length === 3) {
        const dot = dash[2].split(".");
        if (dot.length === 2) {
            const lang = dot[0];
            fs.readFile(file, function (err, data) {
                language_dict[lang] = JSON.parse(data.toString());
            });
        }
    }
});

// Trang chủ
app.get('/', function (req, res) {
    const lang = req.getLocale() || 'en'; // Lấy ngôn ngữ hiện tại từ i18n, mặc định là 'en' nếu không có
    i18n.setLocale(req, lang);
    res.render('index', { lang: lang });
});

// Trang với ngôn ngữ cụ thể
app.get('/:lang', function (req, res, next) {
    const code = req.params.lang;
    if (code !== '' && language_dict.hasOwnProperty(code)) {
        i18n.setLocale(req, code);
        res.render('index', { lang: code });
    } else {
        next(createError(404));
    }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Xử lý yêu cầu tải xuống
app.post("/download", async (req, res) => {
    const url = req.body.url;
    if (!url) {
        const lang = req.getLocale() || 'en'; // Lấy ngôn ngữ hiện tại từ i18n, mặc định là 'en' nếu không có
        return res.status(400).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
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

        const lang = req.getLocale() || 'en'; // Lấy ngôn ngữ hiện tại từ i18n, mặc định là 'en' nếu không có
        res.status(200).render('downloader', { mediaData: mediaData, lang: lang });
    } catch (error) {
        console.log("Error:", error.message);

        if (error.response) {
            const lang = req.getLocale() || 'en'; // Lấy ngôn ngữ hiện tại từ i18n, mặc định là 'en' nếu không có
            const errorMessage = error.response.data.message;
            if (errorMessage === "The download link not found.") {
                return res.status(404).render('index', { error: errorMessage, lang: lang });
            } else if (errorMessage === "The given data was invalid.") {
                return res.status(400).render('index', { error: errorMessage, lang: lang });
            } else {
                return res.status(400).render('index', { error: 'Link URL không hợp lệ', lang: lang });
            }
        } else if (error.request) {
            console.log("Error request:", error.request);
            const lang = req.getLocale() || 'en'; // Lấy ngôn ngữ hiện tại từ i18n, mặc định là 'en' nếu không có
            return res.status(400).render('index', { error: 'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.', lang: lang });
        } else {
            console.log("Error", error.message);
            const lang = req.getLocale() || 'en'; // Lấy ngôn ngữ hiện tại từ i18n, mặc định là 'en' nếu không có
            return res.status(400).render('index', { error: 'Đã xảy ra lỗi khi thiết lập yêu cầu. Vui lòng thử lại sau.', lang: lang });
        }
    }
});

// Xử lý lỗi 404
app.use(function (req, res, next) {
    next(createError(404));
});

// Xử lý lỗi chung
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
