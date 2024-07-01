// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// const axios = require('axios');
// const fs = require('fs').promises; // Sử dụng fs.promises để sử dụng async/await
// const bodyParser = require('body-parser');
// var logger = require('morgan');
// var i18n = require("i18n");
// i18n.configure({
//     locales: [
//         "en",
//         "vi",
//         "tr",
//         "id",
//         "fr",
//         "pt",
//         "ru",
//         "es",
//         "ms",
//         "ko",
//         "ja",
//         "jv",
//         "cs",
//         "de",
//         "it",
//         "pl",
//         "hu",
//         "nl",
//         "ro",
//         "el",
//     ],
//     directory: __dirname + '/language',
//     cookie: 'lang',
//     header: 'accept-language'
// });
// const glob = require('glob');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
//
// var app = express();
//
// app.use(i18n.init);
// app.use(express.static('public'));
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
// app.use('/users', usersRouter);
//
// const language_dict = {};
//
// // Sử dụng async/await để đọc các tệp ngôn ngữ và xây dựng language_dict
// async function loadLanguageFiles() {
//     try {
//         const files = glob.sync('../language/*.json');
//         const promises = files.map(async (file) => {
//             let dash = file.split("/");
//             if (dash.length === 3) {
//                 let dot = dash[2].split(".");
//                 if (dot.length === 2) {
//                     let lang = dot[0];
//                     let data = await fs.readFile(file);
//                     language_dict[lang] = JSON.parse(data.toString());
//                 }
//             }
//         });
//         await Promise.all(promises);
//         console.log('Language files loaded successfully.');
//     } catch (err) {
//         console.error('Error loading language files:', err);
//         throw err;
//     }
// }
//
// // Gọi hàm để tải các tệp ngôn ngữ khi khởi động ứng dụng
// loadLanguageFiles().catch(err => {
//     console.error('Failed to load language files:', err);
//     process.exit(1); // Thoát ứng dụng nếu không tải được các tệp ngôn ngữ
// });
//
// // Xử lý route khi người dùng truy cập vào trang chủ
// app.get('/', function (req, res) {
//     let lang = 'en';
//     i18n.setLocale(req, 'en');
//     res.render('index', {lang: lang});
// });
//
// // Xử lý route khi người dùng truy cập vào trang với ngôn ngữ cụ thể
// app.get('/:lang', function (req, res, next) {
//     const q = req.url;
//     let dash = q.split("/");
//     let lang = undefined;
//     if (dash.length >= 2) {
//         let code = dash[1];
//         if (code !== '' && language_dict.hasOwnProperty(code)) {
//             lang = code;
//         } else {
//             next(createError(404));
//             return;
//         }
//     }
//     if (lang === undefined) lang = 'en';
//     i18n.setLocale(req, lang);
//     res.render('index', {lang: lang});
// });
//
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
//
// // Xử lý route khi người dùng POST yêu cầu download
// // app.post("/download", async (req, res) => {
// //     const url = req.body.url;
// //     if (!url) {
// //         console.error("!url:", error);
// //         return res.status(400).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ" });
// //     }
// //     const options = {
// //         method: 'POST',
// //         url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
// //         headers: {
// //             'content-type': 'application/json',
// //             'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
// //             'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
// //         },
// //         data: {
// //             url: url
// //         }
// //     };
// //     try {
// //         const response = await axios.request(options);
// //         let mediaData = [];
// //
// //         // Trích xuất URL ảnh và video từ dữ liệu phản hồi
// //         if (response.data && response.data.length > 0) {
// //             response.data.forEach(item => {
// //                 let mediaItem = {
// //                     pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
// //                     videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
// //                     picture: item.pictureUrl,
// //                 };
// //                 mediaData.push(mediaItem);
// //             });
// //         }
// //
// //         res.status(200).render('downloader', { mediaData: mediaData });
// //         console.log('Media Data:', mediaData);
// //     } catch (error) {
// //         console.error("Error in /download:", error.message);
// //         res.status(500).render('error', { error: 'Internal Server Error' });
// //     }
// // });
// // Xử lý route khi người dùng POST yêu cầu download
// app.post("/download", async (req, res) => {
//     const url = req.body.url;
//     const lang = req.params.lang || 'en'; // Lấy ngôn ngữ từ đường dẫn, mặc định là tiếng Anh nếu không có
//
//     if (!url) {
//         console.error("!url:", error);
//         return res.status(400).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
//     }
//
//     const options = {
//         method: 'POST',
//         url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
//             'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
//         },
//         data: {
//             url: url
//         }
//     };
//
//     try {
//         const response = await axios.request(options);
//         console.log(response.data);
//
//         let mediaData = [];
//
//         // Xử lý dữ liệu phản hồi và trả về trang downloader
//         if (response.data && response.data.length > 0) {
//             response.data.forEach(item => {
//                 let mediaItem = {
//                     pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
//                     videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
//                     picture: item.pictureUrl,
//                 };
//                 mediaData.push(mediaItem);
//             });
//         }
//
//         res.status(200).render('downloader', { mediaData: mediaData, lang: lang }); // Đảm bảo truyền ngôn ngữ vào view
//
//         console.log('Media Data:', mediaData);
//     } catch (error) {
//         console.error("Error in /download:", error.message);
//         res.status(500).render('error', { error: 'Internal Server Error' });
//     }
// });
//
// // Xử lý lỗi khi không tìm thấy route
// app.use(function (req, res, next) {
//     next(createError(404));
// });
//
// // Middleware xử lý lỗi
// app.use(function (err, req, res, next) {
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     res.status(err.status || 500);
//     res.render('error');
// });
//
// module.exports = app;





//
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// const axios = require('axios');
// const fs = require('fs');
// const bodyParser = require('body-parser');
// var logger = require('morgan');
// var i18n = require("i18n");
// i18n.configure({
//     locales: [
//         "en",
//         "vi",
//         "tr",
//         "id",
//         "fr",
//         "pt",
//         "ru",
//         "es",
//         "ms",
//         "ko",
//         "ja",
//         "jv",
//         "cs",
//         "de",
//         "it",
//         "pl",
//         "hu",
//         "nl",
//         "ro",
//         "el",
//     ],
//     directory: __dirname + '/language',
//     cookie: 'lang',
//     header: 'accept-language'
// });
// const glob = require('glob');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
//
// var app = express();
//
// app.use(i18n.init);
// app.use(express.static('public'));
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
//
// app.use('/users', usersRouter);
//
// const language_dict = {};
// // Sử dụng Promise.all để đợi cho tất cả các lời hứa được giải quyết trước khi tiếp tục
// // glob.sync('../language/*.json').forEach(function (file) {
// //     console.log(file)
// //     let dash = file.split("/");
// //     if (dash.length == 3) {
// //         let dot = dash[2].split(".");
// //         if (dot.length == 2) {
// //             let lang = dot[0];
// //             fs.readFile(file, function (err, data) {
// //                 language_dict[lang] = JSON.parse(data.toString());
// //             });
// //         }
// //     }
// // });
// glob.sync('../language/*.json').forEach(function (file) {
//     let dash = file.split("/");
//     if (dash.length === 3) {
//         let dot = dash[2].split(".");
//         if (dot.length === 2) {
//             let lang = dot[0];
//             fs.readFile(file, function (err, data) {
//                 language_dict[lang] = JSON.parse(data.toString());
//             });
//         }
//     }
// });
// app.get('/', function (req, res) {
//     let lang = 'en';
//     i18n.setLocale(req, 'en')
//     res.render('index', {lang: lang})
// })
// // app.get('/download', function (req, res) {
// //     let lang = 'en';
// //     i18n.setLocale(req, 'en')
// //     res.render('index', {lang: lang})
// // })
// // viết câu lệnh xử lý khi người dùng truy cập trang có ngôn ngữ cụ thể :
//
// app.get('/:lang', function (req, res, next) {
// // lấy ra địa chỉ truy vấn
//     const q = req.url;
//     // tách ra language code từ địa chỉ truy vấn
//     let dash = q.split("/");
//     let lang = undefined
//     if (dash.length >= 2) {
//         let code = dash[1];
//         console.log(language_dict)
//         console.log('code = ' + code)
//         console.log(language_dict[code])
//         if (code !== '' && language_dict.hasOwnProperty(code)) {
//             lang = code;
//             console.log('AAAA' + lang)
//         } else {
//             next(createError(404))
//             return
//         }
//     }
//     if (lang == undefined) lang = 'en'
//     i18n.setLocale(req, lang)
//     res.render('index', {lang: lang})
// })
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// app.post("/download", async (req, res) => {
//     const url = req.body.url;
//     if (!url) {
//
//         console.error("!url:", error);
//         let lang = req.params.lang || 'en'; // Lấy ngôn ngữ từ đường dẫn, mặc định là tiếng Anh nếu không có
//         res.status(400).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
//         console.log("language:"+lang)
//         return;
//     }
//
//     const options = {
//         method: 'POST',
//         url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
//             'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
//         },
//         data: {
//             url: url
//         }
//     };
//
//     try {
//         const response = await axios.request(options);
//         console.log(response.data);
//
//         let mediaData = [];
//
//         // Xử lý dữ liệu phản hồi và trả về trang downloader
//         if (response.data && response.data.length > 0) {
//             response.data.forEach(item => {
//                 let mediaItem = {
//                     pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
//                     videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
//                     picture: item.pictureUrl,
//                 };
//                 mediaData.push(mediaItem);
//             });
//         }
//         res.status(200).render('downloader', { mediaData: mediaData, lang: req.params.lang });
//         console.log('Media Data:', mediaData);
//         console.log('language:', req.params.lang);
//     } catch (error) {
//         console.log("Error:", error.message);
//
//     }
// });
// app.use(function (req, res, next) {
//     next(createError(404));
// });
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
//
// module.exports = app;


//
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// const axios = require('axios');
// const fs = require('fs');
// const bodyParser = require('body-parser');
// var logger = require('morgan');
// var i18n = require("i18n");
// const glob = require('glob');
//
// i18n.configure({
//     locales: [
//         "en",
//         "vi",
//         "tr",
//         "id",
//         "fr",
//         "pt",
//         "ru",
//         "es",
//         "ms",
//         "ko",
//         "ja",
//         "jv",
//         "cs",
//         "de",
//         "it",
//         "pl",
//         "hu",
//         "nl",
//         "ro",
//         "el",
//     ],
//     directory: __dirname + '/language',
//     cookie: 'lang',
//     header: 'accept-language'
// });
// const glob = require('glob');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
//
// var app = express();
//
// app.use(i18n.init);
// app.use(express.static('public'));
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
//
// app.use('/users', usersRouter);
//
// const language_dict = {};
// // Sử dụng Promise.all để đợi cho tất cả các lời hứa được giải quyết trước khi tiếp tục
// glob.sync('./language/*.json').forEach(function (file) {
//     console.log(file)
// // glob.sync('../language/*.json').forEach(function (file) {
// //     console.log(file)
// //     let dash = file.split("/");
// //     if (dash.length == 3) {
// //         let dot = dash[2].split(".");
// //         if (dot.length == 2) {
// //             let lang = dot[0];
// //             fs.readFile(file, function (err, data) {
// //                 language_dict[lang] = JSON.parse(data.toString());
// //             });
// //         }
// //     }
// // });
//     glob.sync('../language/*.json').forEach(function (file) {
//         let dash = file.split("/");
//         if (dash.length == 3) {
//             let dot = dash[2].split(".");
//             if (dot.length == 2) {
//                 let lang = dot[0];
//                 fs.readFile(file, function (err, data) {
//                     language_dict[lang] = JSON.parse(data.toString());
//                 });
//         }
//         }
//     });
//
// // viết câu lệnh xử lý khi người dùng truy cập trang chủ
//     app.get('/', function (req, res) {
//         let lang = req.cookies.lang || 'en'; // Lấy ngôn ngữ từ cookie hoặc mặc định là 'en'
//         i18n.setLocale(req, lang);
//         res.render('index', { lang: lang, error: null });
//     });
//
//     let lang = 'en';
//     i18n.setLocale(req, 'en')
//     res.render('index', {lang: lang})
// })
// // app.get('/download', function (req, res) {
// //     let lang = 'en';
// //     i18n.setLocale(req, 'en')
// //     res.render('index', {lang: lang})
// // })
// // viết câu lệnh xử lý khi người dùng truy cập trang có ngôn ngữ cụ thể :
//
// app.get('/:lang', function (req, res, next) {
//     // lấy ra địa chỉ truy vấn
//     const lang = req.params.lang;
//     if (language_dict.hasOwnProperty(lang)) {
//         res.cookie('lang', lang, { maxAge: 900000, httpOnly: true }); // Lưu ngôn ngữ vào cookie
//         i18n.setLocale(req, lang);
//         res.render('index', { lang: lang, error: null });
//     } else {
//         next(createError(404));
//         const q = req.url;
//         // tách ra language code từ địa chỉ truy vấn
//         let dash = q.split("/");
//         let lang = undefined
//         if (dash.length >= 2) {
//             let code = dash[1];
//             console.log(language_dict)
//             console.log('code = ' + code)
//             console.log(language_dict[code])
//             if (code !== '' && language_dict.hasOwnProperty(code)) {
//                 lang = code;
//                 console.log('AAAA' + lang)
//             } else {
//                 next(createError(404))
//                 return
//             }
//         }
//
//     if (lang == undefined) lang = 'en'
//     i18n.setLocale(req, lang)
//     res.render('index', {lang: lang})
// })
//
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
//
// app.post("/download", async (req, res) => {
//     const url = req.body.url;
//     let lang = req.body.lang || req.cookies.lang || 'en'; // Ưu tiên lấy từ body sau đó từ cookie, nếu không có thì mặc định là 'en'
//
//     if (!url) {
//         return res.status(200).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
//         console.error("!url:", error);
//         let lang = req.params.lang || 'en'; // Lấy ngôn ngữ từ đường dẫn, mặc định là tiếng Anh nếu không có
//         res.status(400).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
//         return;
//     }
//
//     const options = {
//         method: 'POST',
//         url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
//             'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
//         },
//         data: {
//             url: url
//         }
//     };
//
//     try {
//         const response = await axios.request(options);
//         console.log(response.data);
//
//         let mediaData = [];
//
//         // Xử lý dữ liệu phản hồi và trả về trang downloader
//         if (response.data && response.data.length > 0) {
//             response.data.forEach(item => {
//                 let mediaItem = {
//                     pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
//                     videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
//                     picture: item.pictureUrl,
//                 };
//                 mediaData.push(mediaItem);
//             });
//         }
//
//         if (response.data && response.data.result && response.data.result.length > 0) {
//             response.data.result.forEach(item => {
//                 let video_stos = [];
//                 let picture_stos = [];
//
//                 if (item.video_versions && Array.isArray(item.video_versions)) {
//                     video_stos = item.video_versions.map(video => video.url);
//                 }
//
//                 if (item.image_versions2 && item.image_versions2.candidates) {
//                     picture_stos = item.image_versions2.candidates.map(candidate => candidate.url);
//                 }
//
//                 mediaData.push({
//                     video_stos: video_stos,
//                     picture_stos: picture_stos
//                 });
//             });
//         }
//
//         res.status(200).render('downloader', { mediaData: mediaData, lang: lang });
//         res.status(200).render('downloader', { mediaData: mediaData, lang: req.params.lang });
//         console.log('Media Data:', mediaData);
//     } catch (error) {
//         console.log("Error:", error.message);
//
//     }
// });
//
//
// // error handler
// // app.post("/download", async (req, res) => {
// //     const url = req.body.url;
// //     if (!url) {
// //         console.error("!url:", error);
// //         return  res.status(200).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ" });
// //
// //
// //     }
// //     const options = {
// //         method: 'POST',
// //         url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
// //         headers: {
// //             'content-type': 'application/json',
// //             'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
// //             'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
// //         },
// //         data: {
// //             url: url
// //         }
// //     };
// //
// //     try {
// //         const response = await axios.request(options);
// //         console.log(response.data);
// //
// //         let mediaData = [];
// //
// //
// //         // // Trích xuất URL ảnh và video từ dữ liệu phản hồi
// //         if (response.data && response.data.length > 0) {
// //             response.data.forEach(item => {
// //                 let mediaItem = {
// //                     pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
// //                     videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
// //                     picture: item.pictureUrl,
// //                 };
// //                 mediaData.push(mediaItem);
// //             });
// //         }  // Trích xuất URL ảnh và video từ dữ liệu phản hồi
// //         // Trích xuất URL ảnh và video từ dữ liệu phản hồi
// //         if (response.data && response.data.result && response.data.result.length > 0) {
// //             response.data.result.forEach(item => {
// //                 let video_stos = [];
// //                 let picture_stos = [];
// //
// //                 // Lấy link video từ video_versions
// //                 if (item.video_versions && Array.isArray(item.video_versions)) {
// //                     video_stos = item.video_versions.map(video => video.url);
// //                     console.log("Video URLs from video_versions:", video_stos);
// //                 }
// //
// //                 // Lấy link ảnh từ image_versions2
// //                 if (item.image_versions2 && item.image_versions2.candidates) {
// //                     picture_stos = item.image_versions2.candidates.map(candidate => candidate.url);
// //                     console.log("Picture URLs from image_versions2:", picture_stos);
// //                 }
// //
// //                 mediaData.push({
// //                     video_stos: video_stos,
// //                     picture_stos: picture_stos
// //                 });
// //             });
// //         }
// //
// //
// //         res.status(200).render('downloader', {mediaData: mediaData});
// //         console.log('Media Data:', mediaData);
// //     } catch (error) {
// //         console.log("check",error.message)
// //         if (error.response) {
// //             let lang = req.getLocale(); // Lấy ngôn ngữ hiện tại từ i18n
// //             if (!lang) lang = 'en'; // Nếu không có ngôn ngữ xác định, mặc định là tiếng Anh
// //
// //             console.log("Error response data:", error.response.data);
// //             console.log("Error response status:", error.response.status);
// //             console.log("Error response headers:", error.response.headers);
// //             let errorMessage = error.response.data.message;
// //             if (errorMessage === "The download link not found.") {
// //                 return res.status(404).render('index', { error: errorMessage, lang: lang });
// //             } else if (errorMessage === "The given data was invalid.") {
// //                 return res.status(400).render('index', { error: errorMessage, lang: lang });
// //             } else {
// //                 return res.status(400).render('index', { error: 'Link URL không hợp lệ', lang: lang });
// //             }
// //
// //         } else if (error.request) {
// //             console.log("Error request:", error.request);
// //             return res.status(200).render('index', { error: 'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.' });
// //         } else {
// //             console.log("Error", error.message);
// //             return res.status(200).render('index', { error: 'Đã xảy ra lỗi khi thiết lập yêu cầu. Vui lòng thử lại sau.' });
// //         }
// //     }
// //
// // });
// // // error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
// module.exports = app;




//doan4
// const createError = require('http-errors');
// const express = require('express');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const axios = require ('axios');
// const fs = require('fs');
// const bodyParser = require('body-parser');
// const logger = require('morgan');
// const i18n = require("i18n");
//
// // Cấu hình i18n cho ứng dụng
// i18n.configure({
//     locales: [
//         "en",
//         "vi",
//         "tr",
//         "id",
//         "fr",
//         "pt",
//         "ru",
//         "es",
//         "ms",
//         "ko",
//         "ja",
//         "jv",
//         "cs",
//         "de",
//         "it",
//         "pl",
//         "hu",
//         "nl",
//         "ro",
//         "el",
//     ],
//     directory: __dirname + '/language', // Thư mục chứa các file ngôn ngữ
//     cookie: 'lang', // Tên cookie để lưu trữ ngôn ngữ
//     header: 'accept-language' // Header để xác định ngôn ngữ từ client
// });
//
// const glob = require('glob');
//
// const indexRouter = require('./routes/index');
// const usersRouter = require('./routes/users');
//
// const app = express();
//
// app.use(i18n.init); // Sử dụng i18n middleware để khởi tạo ngôn ngữ cho request
// app.use(express.static('public')); // Middleware để phục vụ các file tĩnh từ thư mục 'public'
// app.set('views', path.join(__dirname, 'views')); // Thiết lập thư mục chứa các file view là 'views'
// app.set('view engine', 'ejs'); // Sử dụng EJS làm view engine
//
// app.use(logger('dev')); // Sử dụng middleware logger trong chế độ 'dev'
// app.use(express.json()); // Middleware để xử lý JSON body của request
// app.use(express.urlencoded({ extended: false })); // Middleware để xử lý x-www-form-urlencoded body của request
// app.use(cookieParser()); // Middleware để xử lý cookie
// app.use(express.static(path.join(__dirname, 'public'))); // Middleware để phục vụ các file tĩnh từ thư mục 'public'
//
// app.use('/users', usersRouter); // Sử dụng router được định nghĩa trong usersRouter cho route '/users'
//
// const language_dict = {}; // Đối tượng để lưu trữ dữ liệu từ các file ngôn ngữ
//
// // Đọc các file ngôn ngữ và lưu vào biến language_dict
// glob.sync('../language/*.json').forEach(function (file) {
//     const dash = file.split("/");
//     if (dash.length === 3) {
//         const dot = dash[2].split(".");
//         if (dot.length === 2) {
//             const lang = dot[0];
//             fs.readFile(file, function (err, data) {
//                 language_dict[lang] = JSON.parse(data.toString());
//             });
//         }
//     }
// });
//
// // Route cho trang chủ '/'
// app.get('/', function (req, res) {
//     const lang = req.getLocale() || 'en'; // Lấy ngôn ngữ hiện tại từ i18n, mặc định là 'en' nếu không có
//     i18n.setLocale(req, lang); // Đặt ngôn ngữ cho request
//     res.render('index', { lang: lang }); // Render trang index với tham số lang là ngôn ngữ hiện tại
// });
//
// // Route cho trang có ngôn ngữ cụ thể, ví dụ '/en', '/vi'
// app.get('/:lang', function (req, res, next) {
//     const code = req.params.lang; // Lấy mã ngôn ngữ từ URL
//     if (code !== '' && language_dict.hasOwnProperty(code)) {
//         i18n.setLocale(req, code); // Đặt ngôn ngữ cho request
//         res.render('index', { lang: code }); // Render trang index với tham số lang là mã ngôn ngữ từ URL
//     } else {
//         next(createError(404)); // Nếu mã ngôn ngữ không tồn tại trong dictionary, gọi middleware error 404
//     }
// });
//
// app.use(bodyParser.urlencoded({ extended: true })); // Middleware để xử lý body dạng x-www-form-urlencoded
// app.use(bodyParser.json()); // Middleware để xử lý JSON body
//
// // Xử lý POST request '/download'
// app.post("/download", async (req, res) => {
//     const url = req.body.url;
//     const lang = req.getLocale() || 'en'; // Lấy ngôn ngữ hiện tại từ i18n, mặc định là 'en' nếu không có
//
//     if (!url) {
//         return res.status(400).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
//     }
//
//     const options = {
//         method: 'POST',
//         url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
//             'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
//         },
//         data: {
//             url: url
//         }
//     };
//
//     try {
//         const response = await axios.request(options);
//         let mediaData = [];
//
//         if (response.data && response.data.length > 0) {
//             response.data.forEach(item => {
//                 let mediaItem = {
//                     pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
//                     videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
//                     picture: item.pictureUrl,
//                 };
//                 mediaData.push(mediaItem);
//             });
//         }
//
//         res.status(200).render('downloader', { mediaData: mediaData, lang: lang }); // Render trang downloader với dữ liệu media và ngôn ngữ hiện tại
//         console.log("language:"+lang)
//     } catch (error) {
//
//     }
// });
//
// // Middleware xử lý khi route không tồn tại (404)
// app.use(function (req, res, next) {
//     next(createError(404));
// });
//
// // Middleware xử lý lỗi chung
// app.use(function (err, req, res, next) {
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     res.status(err.status || 500);
//     res.render('error'); // Render trang lỗi
// });
//
// module.exports = app; // Xuất ứng dụng Express


// đoạn 55555
// var createError = require('http-errors');
// var express = require('express');
// var path = require('path');
// var cookieParser = require('cookie-parser');
// const axios = require('axios');
// const fs = require('fs');
// const bodyParser = require('body-parser');
// var logger = require('morgan');
// var i18n = require("i18n");
// i18n.configure({
//     locales: [
//         "en",
//         "vi",
//         "tr",
//         "id",
//         "fr",
//         "pt",
//         "ru",
//         "es",
//         "ms",
//         "ko",
//         "ja",
//         "jv",
//         "cs",
//         "de",
//         "it",
//         "pl",
//         "hu",
//         "nl",
//         "ro",
//         "el",
//     ],
//     directory: __dirname + '/language',
//     cookie: 'lang',
//     header: 'accept-language'
// });
// const glob = require('glob');
//
// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
//
//
// var app = express();
//
// app.use(i18n.init);
// app.use(express.static('public'));
// // view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'ejs');
//
// app.use(logger('dev'));
// app.use(express.json());
// app.use(express.urlencoded({extended: false}));
// app.use(cookieParser());
// app.use(express.static(path.join(__dirname, 'public')));
//
//
// app.use('/users', usersRouter);
//
// const language_dict = {};
// // Sử dụng Promise.all để đợi cho tất cả các lời hứa được giải quyết trước khi tiếp tục
// // glob.sync('../language/*.json').forEach(function (file) {
// //     console.log(file)
// //     let dash = file.split("/");
// //     if (dash.length == 3) {
// //         let dot = dash[2].split(".");
// //         if (dot.length == 2) {
// //             let lang = dot[0];
// //             fs.readFile(file, function (err, data) {
// //                 language_dict[lang] = JSON.parse(data.toString());
// //             });
// //         }
// //     }
// // });
// glob.sync('../language/*.json').forEach(function (file) {
//     let dash = file.split("/");
//     if (dash.length == 3) {
//         let dot = dash[2].split(".");
//         if (dot.length == 2) {
//             let lang = dot[0];
//             fs.readFile(file, function (err, data) {
//                 language_dict[lang] = JSON.parse(data.toString());
//             });
//         }
//     }
// });
// // viết câu lệnh xử lý khi người dùng truy cập trang chủ
// app.get('/', function (req, res) {
//     let lang = req.cookies.lang || 'ja'; // Sử dụng ngôn ngữ từ cookie, mặc định là 'en'
//     i18n.setLocale(req, lang);
//     res.render('index', { lang: lang });
// });
//
// // app.get('/download', function (req, res) {
// //     let lang = 'en';
// //     i18n.setLocale(req, 'en')
// //     res.render('index', {lang: lang})
// // })
// // viết câu lệnh xử lý khi người dùng truy cập trang có ngôn ngữ cụ thể :
// // app.get('/:lang', function (req, res, next) {
// //     let lang = req.params.lang;
// //     if (!language_dict.hasOwnProperty(lang)) {
// //         return next(createError(404));
// //     }
// //     i18n.setLocale(req, lang);
// //     res.render('index', { lang: lang });
// // });
//
// app.get('/:lang', function (req, res, next) {
//     // lấy ra địa chỉ truy vấn
//     const q = req.url;
//     // tách ra language code từ địa chỉ truy vấn
//     let dash = q.split("/");
//     let lang = undefined
//     if (dash.length >= 2) {
//         let code = dash[1];
//         console.log(language_dict)
//         console.log('code = ' + code)
//         console.log(language_dict[code])
//         if (code !== '' && language_dict.hasOwnProperty(code)) {
//             lang = code;
//             console.log('AAAA' + lang)
//         } else {
//             next(createError(404))
//             return
//         }
//     }
//     if (lang == undefined) lang = 'en'
//     i18n.setLocale(req, lang)
//     res.render('index', {lang: lang})
// })
//
// app.use(bodyParser.urlencoded({extended: true}));
// app.use(bodyParser.json());
// //
// app.post("/download", async (req, res) => {
//     const url = req.body.url;
//     let lang = req.query.lang || 'en'; // Lấy ngôn ngữ từ tham số truy vấn, mặc định là 'en' nếu không có
//
//     if (!url) {
//         console.error("!url:", error);
//         return res.status(400).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ", lang: lang });
//     }
//
//     const options = {
//         method: 'POST',
//         url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
//             'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
//         },
//         data: {
//             url: url
//         }
//     };
//
//     try {
//         const response = await axios.request(options);
//         console.log(response.data);
//
//         let mediaData = [];
//
//         if (response.data && response.data.length > 0) {
//             response.data.forEach(item => {
//                 let mediaItem = {
//                     pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
//                     videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
//                     picture: item.pictureUrl,
//                 };
//                 mediaData.push(mediaItem);
//             });
//         }
//
//         if (response.data && response.data.result && response.data.result.length > 0) {
//             response.data.result.forEach(item => {
//                 let video_stos = [];
//                 let picture_stos = [];
//
//                 if (item.video_versions && Array.isArray(item.video_versions)) {
//                     video_stos = item.video_versions.map(video => video.url);
//                     console.log("Video URLs from video_versions:", video_stos);
//                 }
//
//                 if (item.image_versions2 && item.image_versions2.candidates) {
//                     picture_stos = item.image_versions2.candidates.map(candidate => candidate.url);
//                     console.log("Picture URLs from image_versions2:", picture_stos);
//                 }
//
//                 mediaData.push({
//                     video_stos: video_stos,
//                     picture_stos: picture_stos
//                 });
//             });
//         }
//
//         // Lưu ý: Thay đổi 'lang' thành giá trị ngôn ngữ bạn muốn sử dụng
//         res.status(200).render('downloader', { mediaData: mediaData, lang: lang });
//         console.log('Media Data:', lang);
//     } catch (error) {
//
//     }
//
//
// });
//
// // // error handler
// app.use(function (req, res, next) {
//     next(createError(404));
// });
// app.use(function (err, req, res, next) {
//     // set locals, only providing error in development
//     res.locals.message = err.message;
//     res.locals.error = req.app.get('env') === 'development' ? err : {};
//     // render the error page
//     res.status(err.status || 500);
//     res.render('error');
// });
//
// module.exports = app;

//doan6
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const axios = require('axios');
const fs = require('fs');
const bodyParser = require('body-parser');
var logger = require('morgan');
var i18n = require("i18n");
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
const glob = require('glob');

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

app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/users', usersRouter);

const language_dict = {};
// Sử dụng Promise.all để đợi cho tất cả các lời hứa được giải quyết trước khi tiếp tục

// glob.sync('../language/*.json').forEach(function (file) {
//     console.log(file)
//     let dash = file.split("/");
//     if (dash.length == 3) {
//         let dot = dash[2].split(".");
//         if (dot.length == 2) {
//             let lang = dot[0];
//             fs.readFile(file, function (err, data) {
//                 language_dict[lang] = JSON.parse(data.toString());
//             });
//         }
//     }
// });
    glob.sync('../language/*.json').forEach(function (file) {
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


    let lang = 'en';
    i18n.setLocale(req, 'en')
    res.render('index', {lang: lang})
})
// app.get('/download', function (req, res) {
//     let lang = 'en';
//     i18n.setLocale(req, 'en')
//     res.render('index', {lang: lang})
// })
// viết câu lệnh xử lý khi người dùng truy cập trang có ngôn ngữ cụ thể :

app.get('/:lang', function (req, res, next) {
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
    i18n.setLocale(req, lang)
    res.render('index', {lang: lang})
})


app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.post("/download", async (req, res) => {
    const url = req.body.url;

    if (!url) {
       console.error("!url:", error);
        let lang = req.params.lang || 'en'; // Lấy ngôn ngữ từ đường dẫn, mặc định là tiếng Anh nếu không có
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

        // Xử lý dữ liệu phản hồi và trả về trang downloader
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

     
        res.status(200).render('downloader', { mediaData: mediaData, lang: req.params.lang });
        console.log('Media Data:', mediaData);
    } catch (error) {
        console.log("Error:", error.message);

    }
});


// error handler
// app.post("/download", async (req, res) => {
//     const url = req.body.url;
//     if (!url) {
//         console.error("!url:", error);
//         return  res.status(200).render('index', { error: "Link URL không tồn tại hoặc không hợp lệ" });
//
//
//     }
//     const options = {
//         method: 'POST',
//         url: 'https://instagram120.p.rapidapi.com/api/instagram/links',
//         headers: {
//             'content-type': 'application/json',
//             'X-RapidAPI-Key': '16a490b4f8msh223ff679ca0b62fp181abdjsnc4beeb2c44d0',
//             'X-RapidAPI-Host': 'instagram120.p.rapidapi.com'
//         },
//         data: {
//             url: url
//         }
//     };
//
//     try {
//         const response = await axios.request(options);
//         console.log(response.data);
//
//         let mediaData = [];
//
//
//         // // Trích xuất URL ảnh và video từ dữ liệu phản hồi
//         if (response.data && response.data.length > 0) {
//             response.data.forEach(item => {
//                 let mediaItem = {
//                     pictureUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.jpg')).map(urlObj => urlObj.url) : [],
//                     videoUrls: item.urls ? item.urls.filter(urlObj => urlObj.url && urlObj.url.includes('.mp4')).map(urlObj => urlObj.url) : [],
//                     picture: item.pictureUrl,
//                 };
//                 mediaData.push(mediaItem);
//             });
//         }  // Trích xuất URL ảnh và video từ dữ liệu phản hồi
//         // Trích xuất URL ảnh và video từ dữ liệu phản hồi
//         if (response.data && response.data.result && response.data.result.length > 0) {
//             response.data.result.forEach(item => {
//                 let video_stos = [];
//                 let picture_stos = [];
//
//                 // Lấy link video từ video_versions
//                 if (item.video_versions && Array.isArray(item.video_versions)) {
//                     video_stos = item.video_versions.map(video => video.url);
//                     console.log("Video URLs from video_versions:", video_stos);
//                 }
//
//                 // Lấy link ảnh từ image_versions2
//                 if (item.image_versions2 && item.image_versions2.candidates) {
//                     picture_stos = item.image_versions2.candidates.map(candidate => candidate.url);
//                     console.log("Picture URLs from image_versions2:", picture_stos);
//                 }
//
//                 mediaData.push({
//                     video_stos: video_stos,
//                     picture_stos: picture_stos
//                 });
//             });
//         }
//
//
//         res.status(200).render('downloader', {mediaData: mediaData});
//         console.log('Media Data:', mediaData);
//     } catch (error) {
//         console.log("check",error.message)
//         if (error.response) {
//             let lang = req.getLocale(); // Lấy ngôn ngữ hiện tại từ i18n
//             if (!lang) lang = 'en'; // Nếu không có ngôn ngữ xác định, mặc định là tiếng Anh
//
//             console.log("Error response data:", error.response.data);
//             console.log("Error response status:", error.response.status);
//             console.log("Error response headers:", error.response.headers);
//             let errorMessage = error.response.data.message;
//             if (errorMessage === "The download link not found.") {
//                 return res.status(404).render('index', { error: errorMessage, lang: lang });
//             } else if (errorMessage === "The given data was invalid.") {
//                 return res.status(400).render('index', { error: errorMessage, lang: lang });
//             } else {
//                 return res.status(400).render('index', { error: 'Link URL không hợp lệ', lang: lang });
//             }
//
//         } else if (error.request) {
//             console.log("Error request:", error.request);
//             return res.status(200).render('index', { error: 'Không nhận được phản hồi từ máy chủ. Vui lòng kiểm tra kết nối mạng và thử lại.' });
//         } else {
//             console.log("Error", error.message);
//             return res.status(200).render('index', { error: 'Đã xảy ra lỗi khi thiết lập yêu cầu. Vui lòng thử lại sau.' });
//         }
//     }
//
// });
// // error handler
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