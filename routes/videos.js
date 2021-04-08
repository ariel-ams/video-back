const express = require('express');
const router = express.Router();
const Video = require("../models/video");
const path = require('path');
const fs = require('fs');

router.get('/library', (req, res) => {
    Video.find((err, docs) => {
        res.json(docs);
    });
});

router.get('/:videoId/file', (req, res) => {
    Video.findById(req.params.videoId, (err, doc)=>{
        let filePath = path.join(process.cwd(), doc.path);
        res.sendFile(filePath);
    });
})

router.delete('/:videoId', (req, res) => {
    Video.findById(req.params.videoId, (err, doc)=>{
        let filePath = path.join(process.cwd(), doc.path);
        fs.unlink(filePath, () => {
            
        });
        let thumbName = 'thumbnails/' + path.basename(doc.thumbnail);
        let thumbnail = path.join(process.cwd(), thumbName);
        fs.unlink(thumbnail, () => {
            
        });
        doc.remove();

        res.json({message: "Video removed sucessfully"});
    });
})

module.exports = router;