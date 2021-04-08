var mongoose = require('mongoose');

const videoSchema = mongoose.Schema({
    // user_id: {
    //     required: true,
    // },
    name: {
        type: String,
        required: true,
        maxlenght: 50
    },
    audioCodec: {
        type: String,
        required: true,
    },
    videoCodec: {
        type: String,
        required: true,
    },
    lenghtInSeconds:{
        type: Number,
    },
    path:{
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        //required: true,
        maxlenght: 250
    }
});

module.exports = mongoose.model('Video', videoSchema);