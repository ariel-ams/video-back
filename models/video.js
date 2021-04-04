var mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    user_id: {
        required: true,
    },
    name: {
        type: String,
        required: true,
        maxlenght: 50
    },
    codecAudio: {

    },
    codecVideo: {

    },
    lenghtInSeconds:{

    },
    thumbnail: {
        type: String,
        required: true,
        maxlenght: 250
    }
});

module.exports = mongoose.model('Video', videoSchema);