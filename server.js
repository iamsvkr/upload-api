const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const firebase = require('firebase-admin')
const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb)=>{
        cb(null, './uploads/');
    },
    filename: (req, file, cb)=>{
        cb(null, new Date().toISOString()+file.originalname);
    }
});

const upload = multer({storage: storage});

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const serviceAccount = require("./camera.json")

firebase.initializeApp({
    credential: firebase.credential.cert(serviceAccount),
    databaseURL: "https://camera-399df.firebaseio.com"
});

app.post('/', upload.single('productImage'), (req, res, next)=>{
    console.log(req.file);
    var time = new Date().toString();
    firebase.database().ref().child(time).set({
        path: req.file.path,
        name: req.file.filename,
    });
});

app.listen(3000)