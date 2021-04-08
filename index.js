const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./config/config").get(process.env.NODE_ENV);
const { auth } = require("./middlewares/auth");
const cors = require("cors");
const api = require("./routes/api");

const app = express();

app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(cookieParser());

//database connection
mongoose.Promise = global.Promise;
mongoose.connect(
  db.DATABASE,
  { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    useCreateIndex: true
  },
  function (error) {
    if (error) console.error(error);
    console.log("database is connected");
  }
);

var corsOptions = {
  origin: 'http://localhost:3001',
  optionsSuccessStatus: 200 // For legacy browser support
}

app.use(cors(corsOptions));

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3001');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  //res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

//api routes
app.post("/api/register", api.register);
app.post("/api/login", api.login);
app.get("/api/logout", auth, api.logout);
app.get("/api/photos", auth, api.photos);

const uploadRoutes = require('./routes/upload');
app.use("/api/upload", uploadRoutes);

const videos = require('./routes/videos');
app.use("/api/videos", videos);

app.use(express.static(__dirname + '/thumbnails'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`app is live at ${PORT}`);
});