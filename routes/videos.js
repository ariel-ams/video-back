const express = require('express');
const router = express.Router();
const Video = require("../models/video");
const path = require('path');

router.get('/library', (req, res) => {
    Video.find((err, docs) => {
        res.json(docs);
    });
});

router.get('/:videoId/file', (req, res) => {
    //console.log(req.params.videoId);
    Video.findById(req.params.videoId, (err, doc)=>{
        let filePath = path.join(process.cwd(), doc.path);
        console.log(filePath);
        res.sendFile(filePath);
    });
})

module.exports = router;