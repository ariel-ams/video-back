const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Video = require("../models/video");
const ffmpeg = require('fluent-ffmpeg');

const uploadFolder = './thumbnails';

const storage = multer.diskStorage({
    destination: './videos',
    filename: (req, file, cb) => {
        cb(null, "video-" + Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({
    storage: storage
}).single('video');

router.post('/video', upload, (req, res) => {

    getVideoInfoAndMiddleFrame(req.file.path)
        .then(({videoInfo, filename}) => {
            var video = new Video({
                name: path.parse(req.file.originalname).name,
                path: req.file.path,
                audioCodec: videoInfo.audioCodec,
                videoCodec: videoInfo.videoCodec,
                lenghtInSeconds: videoInfo.durationInSeconds,
                thumbnail:  'http://localhost:3000/' + filename
            });
    
            video.save();

            res.send(`video successfully uploaded`);
        });
});

const getVideoInfo = (inputPath) => {
    return new Promise((resolve, reject) => {
      return ffmpeg.ffprobe(inputPath, (error, videoInfo) => {
        if (error) {
          return reject(error);
        }

        var audioCodec = null;
        var videoCodec = null;

        videoInfo.streams.forEach(function(stream){
            if (stream.codec_type === "video")
                videoCodec = stream.codec_name;
            else if (stream.codec_type === "audio")
                audioCodec = stream.codec_name;
        });
  
        const { duration } = videoInfo.format;
  
        return resolve({
          audioCodec,
          videoCodec,
          durationInSeconds: duration,
        });
      });
    });
  };

const getVideoInfoAndMiddleFrame = (
    inputPath
  ) => {
    return new Promise(async (resolve, reject) => {
      const videoInfo = await getVideoInfo(inputPath);
    
      return ffmpeg(inputPath)
        .screenshots({
            count: 1,
            filename: '%b-%s.png',
            folder: uploadFolder
        }).on('filenames', function(filenames){
            resolve({videoInfo, filename: filenames[0]})
        })
        .on('error', reject);
    });
  };

module.exports = router;