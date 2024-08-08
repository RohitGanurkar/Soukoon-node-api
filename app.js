require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const adminRoutes = require('./routes/admin');
const verifyRoutes = require('./routes/verifytoken');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const addvideoRoutes = require('./routes/addvideo');
const addtopvideoRoutes = require('./routes/addtopvideo');
const taleemcategory = require('./routes/taleemcategory');
const taleemsubcategory = require('./routes/taleemsubcategory');
const taleemcontent = require('./routes/taleemcontent');
const history = require('./routes/history');
const watchlater = require('./routes/watchlater');
const likevideo = require('./routes/likevideo');
const viewcount = require('./routes/viewcount');
const userfollow = require('./routes/userfollow');
const os = require('os');
const { send } = require('process');

const getIPAddress = () => {
  const interfaces = os.networkInterfaces();
  for (const interfaceName in interfaces) {
    const interface = interfaces[interfaceName];
    for (const info of interface) {
      if (!info.internal && info.family === 'IPv4') {
        return info.address;
      }
    }
  }
  return false;
}


// const db ='mongodb+srv://sukoon734:sukoon734sukoon@sukoon.prsx3.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'
// const db = 'mongodb+srv://rahul:rahul@clustersukoon.tk9czfe.mongodb.net/?retryWrites=true&w=majority&appName=ClusterSukoon' || ''

const db= "mongodb+srv://rahul:rahul@cluster0.ewmtw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
// const db= "mongodb://127.0.0.1:27017/sukoon"
mongoose.connect(db,
  { 
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then(() => {
    console.log(`connection Successfully`);
  }).catch((err) => {
    console.log(`no Connection` + "err");
    console.log(`no Connection` + err);
  })


const app = express();
const port = 5000;
const host = '127.0.0.1';



app.use((req, res, next) => {
  console.log(req.path, req.method)
  next()
})


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use('/uploads', express.static('./uploads'));
app.use('/topuploads', express.static('./topuploads'))
app.use('/sukoonaudio', express.static('./sukoonaudio'))
app.use('/', adminRoutes);
app.use('/', verifyRoutes);
app.use('/user', userRoutes);
app.use('/category', categoryRoutes);
app.use('/video', addvideoRoutes);
app.use('/topvideo', addtopvideoRoutes);
app.use('/taleemcategory', taleemcategory);
app.use('/taleemsubcategory', taleemsubcategory);
app.use('/taleemcontent', taleemcontent);
app.use('/history', history);
app.use('/watchlater', watchlater);
app.use('/like', likevideo);
app.use('/view', viewcount);
app.use('/userfollow', userfollow);


app.use(function (req, res, next) {
  // check header or url parameters or post parameters for token
  var token = req.headers['authorization'];
  if (!token) return next(); //if no token, continue

  token = token.replace('Bearer ', '');
  jwt.verify(token, process.env.JWT_SECRET, function (err, user) {
    if (err) {
      return res.status(401).json({
        error: true,
        message: "Invalid user."
      });
    } else {
      req.user = user; //set the user to req so other routes can use it
      next();
    }
  });
});

app.get('/' , (req , res)=>{
  res.send('Sukoon is running')
})

const IpAddress = getIPAddress();
app.listen(4568, () => {
  console.log(`Server is listeing on http://${IpAddress ? IpAddress : "localhost"}:${4568}/`)
});

