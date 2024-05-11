const express = require('express');
const router = express.Router();
const InstagramUrlDirect = require('instagram-url-direct');
const axios = require('axios');
const fs = require('fs');

router.get('/download-instagram-image', async function(req, res, next) {
    try {
        const instagramUrl = req.query.url;
        const imageUrl = await InstagramUrlDirect.getImageUrl(instagramUrl);
        // Kiểm tra xem imageUrl có giá trị không trước khi tải ảnh
        if (imageUrl) {
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            res.set('Content-Type', 'image/jpeg');
            res.set('Content-Disposition', 'attachment; filename="image.jpg"');
            res.send(imageResponse.data);
        } else {
            res.status(400).send('Không thể tải ảnh từ URL Instagram.');
        }
    } catch (error) {
        console.error('Lỗi khi tải ảnh từ Instagram:', error);
        res.status(500).send('Đã xảy ra lỗi khi tải ảnh từ Instagram.');
    }
});

module.exports = router;