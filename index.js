var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')
app.use(bodyParser.urlencoded({ extended: true }))

// express app
var app = express()
app.use(cors())
app.use(bodyParser.json())

// session
var session = require('express-session')

var oneWeek = 1000 * 60 * 60 * 24 * 7
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'MyLovelyYaeMiko',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: oneWeek }
}))

// cookie parser
var cookieParser = require('cookie-parser')
app.use(cookieParser());

// routes
app.get('/', (req, res)=>{
    session = req.session
    if (session.uid) {
        res.json({
            message: 'Welcome ' + session.username,
            data: session
        })
    }
    else{
        res.json({
            message: 'Welcome guest',
            data: session
        })
    }
})
// auth route
var auth = require('./route/auth')
app.use(auth)
// profile route
var profile = require('./route/profile')
app.use(profile)
// makanan route
var makanan = require('./route/makanan')
app.use(makanan)

// server
var port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log('Server berjalan di port ' + port)
})
