var router = require('express').Router()
var fire = require('../config/dbConfig')
var bodyParser = require('body-parser')
var db = fire.firestore()
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))

// get all makanan
router.get('/makanan', (req, res)=>{
    var makanan = []
    db.collection('makanan').get()
    .then((snapshot)=>{
        snapshot.forEach((doc)=>{
            makanan.push(doc.data())
        })
        res.json({
            message: 'success',
            data: makanan
        })
    })
    .catch((err)=>{
        res.json({
            message: 'error',
            data: err
        })
    })
})

// get makanan by nama_makanan
router.get('/makanan/:nama_makanan', (req, res)=>{
    var nama_makanan = req.params.nama_makanan
    db.collection('makanan').where('nama_makanan', '==', nama_makanan).get()
    .then((snapshot)=>{
        var makanan = []
        snapshot.forEach((doc)=>{
            makanan.push(doc.data())
        })
        res.json({
            message: 'success',
            data: makanan
        })
    })
    .catch((err)=>{
        res.json({
            message: 'error',
            data: err
        })
    })
})

// get makanan by highiest search_record from database makanan  (top 5)
// router.get('/makanan/top', (req, res)=>{
//     var makanan = []
//     db.collection('makanan').orderBy('search_record', 'desc').limit(5).get()
//     .then((snapshot)=>{
//         snapshot.forEach((doc)=>{
//             makanan.push(doc.data())
//         })
//         res.json({
//             message: 'success',
//             data: makanan
//         })
//     })
//     .catch((err)=>{
//         res.json({
//             message: 'error',
//             data: err
//         })
//     })
// })

// export router
module.exports = router