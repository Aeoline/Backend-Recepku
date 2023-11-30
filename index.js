var express = require('express')
var bodyParser = require('body-parser')
var cors = require('cors')

// express app
var app = express()
app.use(cors())
app.use(bodyParser.json())

// session
var session = require('express-session')

var oneWeek = 1000 * 60 * 60 * 24 * 7
app.set('trust proxy', 1) // trust first proxy
app.use(session({
    secret: 'MyLovelyRaidenShogun',
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
    if(session.username){
        res.json({
            message: 'Welcome ' + session.username,
            data: session
        })
    }
    else{
        res.json({
            message: 'Welcome guest',
            // data: session
        })
    }
})

var auth = require('./route/auth')
app.use(auth)

// server
var port = process.env.PORT || 3000
app.listen(port, ()=>{
    console.log('Server berjalan di port ' + port)
})
