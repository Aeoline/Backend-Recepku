var router = require('express').Router()
var fire = require('../config/dbConfig')
var bodyParser = require('body-parser')
var bycript = require('bcryptjs')
var db = fire.firestore()
router.use(bodyParser.json())

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
    db.collection('users')
    .doc('/'+data.username+'/')
    .get()
    .then((doc)=>{
        if(doc.exists){
            console.log(doc.data().username)
            // console.log('username sudah terdaftar')
            return res.status(500).send('username sudah terdaftar')
        } else if(data.username.length < 5){
            console.log('username harus lebih dari 5 karakter')
            return res.status(500).send('username harus lebih dari 5 karakter')
        } else if(data.username.length > 20){
            console.log('username harus kurang dari 20 karakter')
            return res.status(500).send('username harus kurang dari 20 karakter')
        } else if(data.password.length < 7){
            console.log('password harus lebih dari 7 karakter')
            return res.status(500).send('password harus lebih dari 7 karakter')
        } else if(data.email.length < 1){
            console.log('email tidak boleh kosong')
            return res.status(500).send('email tidak boleh kosong')
        } else if(data.email.length > 0){
            db.collection('users')
            .where('email', '==', data.email)
            .get()
            .then((doc) => {
                if(doc.empty){
                    bycript.hash(data.password, 10, (err, hash)=>{
                        data.password = hash
                        db.collection('users')
                        .doc('/'+data.username+'/')
                        .create({
                            'username': data.username,
                            'password': data.password,
                            'email': data.email,
                            'created_on': convertTZ(new Date(), "Asia/Jakarta"),
                        })
                        .then(()=>{
                            console.log('User berhasil dibuat')
                            return res.status(200).send('User berhasil dibuat')
                        })
                        .catch((error)=>{
                            console.log(error)
                            return res.status(500).send(error)
                        })
                    })
                }else{
                    console.log('email sudah terdaftar')
                    return res.status(500).send('email sudah terdaftar')
                }
            })
            .catch((error)=>{
                console.log(error)
                return res.status(500).send(error)
            })
        }
    })
    .catch((error)=>{
        console.log(error)
        return res.status(500).send(error)
    })
})

// route for login username or email and password with validation
router.post('/login', (req, res)=>{
    var data = req.body
    db.collection('users')
    .doc('/'+data.username+'/')
    .get()
    .then((doc)=>{
        if(doc.exists){
            bycript.compare(data.password, doc.data().password, (err, result)=>{
                if(result){
                    req.session.username = data.username
                    req.session.email = doc.data().email
                    console.log('Welcome ' + req.session.username)
                    return res.status(200).send('Welcome ' + req.session.username)
                }else{
                    console.log('password salah')
                    return res.status(500).send('password salah')
                }
            })
        }else{
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
                            req.session.username = doc.docs[0].data().username
                            req.session.email = doc.docs[0].data().email
                            console.log('Welcome ' + req.session.username)
                            return res.status(200).send('Welcome ' + req.session.username)
                        }else{
                            console.log('password salah')
                            return res.status(500).send('password salah')
                        }
                    })
                }
            })
            .catch((error)=>{
                console.log(error)
                return res.status(500).send(error)
            })
        }
    })
    .catch((error)=>{
        console.log(error)
        return res.status(500).send(error)
    })
})

// // route for login username or email and password with validation 
// router.post('/login', (req, res)=>{
//     db.settings({
//         timestampsInSnapshots: true
//     })
//     var data = req.body
//     db.collection('users')
//     .doc('/'+data.username+'/')
//     .get()
//     .then((doc)=>{
//         if(doc.exists){
//             bycript.compare(data.password, doc.data().password, (err, result)=>{
//                 if(result){
//                     req.session.username = data.username
//                     console.log('Welcome ' + req.session.username)
//                     return res.status(200).send('Welcome ' + req.session.username)
//                 }else{
//                     console.log('password salah')
//                     return res.status(500).send('password salah')
//                 }
//             })
//         }else{
//             console.log('username tidak terdaftar')
//             return res.status(500).send('username tidak terdaftar')
//         }
//     })
//     .catch((error)=>{
//         console.log(error)
//         return res.status(500).send(error)
//     })
// })

// route for authenticated user
router.get('/user', (req, res)=>{
    session = req.session
    if(session.username){
        console.log(session)
        return res.status(200).send(session)
    }else{
        console.log('Authentication failed the user is not logged in')
        return res.status(200).send('Authentication failed the user is not logged in')
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

// export module
module.exports = router;