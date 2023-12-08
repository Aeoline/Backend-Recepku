var router = require('express').Router()
var fire = require('../config/dbConfig')
var bodyParser = require('body-parser')
var bycript = require('bcryptjs')
var db = fire.firestore()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({extended: true}))
const { v4: uuidv4 } = require('uuid');

// timestamp
db.settings({
    timestampsInSnapshots: true
})

// timezone jakarta
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));   
}

// route for register username and hashed password with validation
router.post('/register', (req, res)=>{
    var data = req.body
    var uid = uuidv4()

    // // check uid is available
    // while(true){
    //     db.collection('users')
    //     .where('uid', '==', uid)
    //     .get()
    //     .then((doc)=>{
    //         if(doc.empty){
    //             return uid
    //         }else{
    //             uid = uuidv4()
    //         }
    //     })
    // }

    // add user to database
    db.collection('users')
    .where('username', '==', data.username)
    .get()
    .then((doc)=>{
        if(doc.empty){
            if(data.username.length < 5){
                console.log('username harus lebih dari 5 karakter')
                return res.status(500).json({
                    error: true,
                    message: 'username harus lebih dari 5 karakter'
                })
            } else if(data.username.length > 20){
                console.log('username harus kurang dari 20 karakter')
                return res.status(500).json({
                    error: true,
                    message: 'username harus kurang dari 20 karakter'
                })
            } else if(data.password.length < 7){
                console.log('password harus lebih dari 7 karakter')
                return res.status(500).json({
                    error: true,
                    message: 'password harus lebih dari 7 karakter'
                })
            } else if(!data.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)){
                console.log('email tidak valid')
                return res.status(500).json({
                    error: true,
                    message: 'email tidak valid'
                })
            } else if(data.email.length > 0){
                db.collection('users')
                .where('email', '==', data.email)
                .get()
                .then((doc) => {
                    if(doc.empty){
                        bycript.hash(data.password, 10, (err, hash)=>{
                            data.password = hash
                            db.collection('users')
                            .doc('/'+uid+'/')
                            .create({
                                'uid': uid,
                                'username': data.username,
                                'password': data.password,
                                'email': data.email,
                                'created_on': convertTZ(new Date(), "Asia/Jakarta"),
                            })
                            .then(()=>{
                                console.log('User berhasil dibuat')
                                return res.status(200).json({
                                    error: false,
                                    message: 'User berhasil dibuat'
                                })
                            })
                            .catch((error)=>{
                                console.log(error)
                                return res.status(500).json({
                                    error: true,
                                    message: error
                                })
                            })
                        })
                    }else{
                        console.log(`email ${doc.docs[0].data().email} sudah terdaftar`)
                        return res.status(500).json({
                            error: true,
                            message: `email ${doc.docs[0].data().email} sudah terdaftar`
                        })
                    }
                })
                .catch((error)=>{
                    console.log(error)
                    return res.status(500).json({
                        error: true,
                        message: error
                    })
                }
            )}
        }
        else{
            console.log(`username ${doc.docs[0].data().username} sudah terdaftar`)
            return res.status(500).json({
                error: true,
                message: `username ${doc.docs[0].data().username} sudah terdaftar`
            })
        }
    })
    .catch((error)=>{
        console.log(error)
        return res.status(500).json({
            error: true,
            message: error
        })
    })
})


// route for get register info
router.get('/register', (req, res)=>{
    session = req.session
    if(session.username){
        console.log(session)
        return res.status(200).json({
            error: false,
            message: 'User Created',
            data: session
        })
    }else{
        console.log('Not Found')
        return res.status(200).json({
            error: true,
            message: 'Not Found'
        })
    }
})

// route for login username or email and password with validation
router.post('/login', (req, res)=>{
    var data = req.body
    db.collection('users')
    .where('username', '==', data.username)
    .get()
    .then((doc)=>{
        if(doc.empty){
            db.collection('users')
            .where('email', '==', data.username)
            .get()
            .then((doc)=>{
                if(doc.empty){
                    console.log('username atau email tidak terdaftar')
                    return res.status(500).send('username atau email tidak terdaftar')
                }else{
                    bycript.compare(data.password, doc.docs[0].data().password, (err, result)=>{
                        if(result){
                            req.session.uid = doc.docs[0].data().uid
                            req.session.username = doc.docs[0].data().username
                            req.session.email = doc.docs[0].data().email
                            console.log('Welcome ' + req.session.username)
                            return res.status(200).json({
                                error: false,
                                message: 'Welcome ' + req.session.username,
                                data: req.session
                            })
                        }else{
                            console.log('password salah')
                            return res.status(500).json({
                                error: true,
                                message: 'password salah'
                            })
                        }
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
                return res.status(500).json({
                    error: true,
                    message: error
                })
            })
        }else{
            bycript.compare(data.password, doc.docs[0].data().password, (err, result)=>{
                if(result){
                    req.session.uid = doc.docs[0].data().uid
                    req.session.username = doc.docs[0].data().username
                    req.session.email = doc.docs[0].data().email
                    console.log('Welcome ' + req.session.username)
                    return res.status(200).json({
                        error: false,
                        message: 'Welcome ' + req.session.username,
                        data: req.session
                    })
                }else{
                    console.log('password salah')
                    return res.status(500).json({
                        error: true,
                        message: 'password salah'
                    })
                }
            })
        }
    })
    .catch((error)=>{
        console.log(error)
        return res.status(500).json({
            error: true,
            message: error
        })
    })
})

// get login info
router.get('/login', (req, res)=>{
    session = req.session
    if(session.username){
        console.log(session)
        return res.status(200).json({
            error: false,
            message: 'Authentication success',
            data: session
        })
    }else{
        console.log('Authentication failed the user is not logged in')
        return res.status(500).json({
            error: true,
            message: 'Authentication failed the user is not logged in'

        })
    }
})

// route for authenticated user
router.get('/user', (req, res)=>{
    session = req.session
    if(session.uid){
        db.collection('users')
        .where('uid', '==', session.uid)
        .get()
        .then((doc)=>{
            if(doc.empty){
                console.log('Tidak ada user')
                return res.status(200).json({
                    error: true,
                    message: 'Tidak ada user'
                })
            }else{
                var users = []
                doc.forEach((doc)=>{
                    users.push(doc.data())
                })
                console.log(users)
                return res.status(200).json({
                    error: false,
                    message: 'Berhasil mendapatkan user',
                    data: users
                })
            }
        })
    }else{
        console.log('Authentication failed user is not logged in')
        return res.status(500).json({
            error: true,
            message: 'Authentication failed user is not logged in'
        })
    }
})

// route for logout
router.get('/logout', (req, res)=>{
    req.session.destroy((err)=>{
        if(err){
            console.log(err)
        }else{
            console.log('Logout berhasil')
            res.redirect('/')
        }
    })
})

// route for get all users
router.get('/users', (req, res)=>{
    db.collection('users')
    .get()
    .then((doc)=>{
        if(doc.empty){
            console.log('Tidak ada user')
            return res.status(200).json({
                error: true,
                message: 'Tidak ada user'
            })
        }else{
            var users = []
            doc.forEach((doc)=>{
                users.push(doc.data())
            })
            console.log(users)
            return res.status(200).json({
                error: false,
                message: 'Berhasil mendapatkan semua user',
                data: users
            })
        }
    })
    .catch((error)=>{
        console.log(error)
        return res.status(500).json({
            error: true,
            message: error
        })
    })
})

// export module
module.exports = router;