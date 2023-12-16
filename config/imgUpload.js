'use strict'
const {Storage} = require('@google-cloud/storage')
const fs = require('fs')
const dateFormat = require('dateformat')
const path = require('path');

const pathKey = path.resolve('./serviceaccountkey.json')

// TODO: Sesuaikan konfigurasi Storage
const gcs = new Storage({
    projectId: 'capstone-bangkit01',
    keyFilename: pathKey
})

// TODO: Tambahkan nama bucket yang digunakan dan folder Foto-Profile di dalam bucket
const bucketName = 'capstone-bangkit-bucket'
const bucket = gcs.bucket(bucketName)

// folder di dalam bucket
const folder = 'Photo-Profile'

// fungsi untuk membuat nama file unik
function getPublicUrl(filename) {
    return `https://storage.googleapis.com/${bucketName}/${folder}/${filename}`
}

let ImgUpload = {}

ImgUpload.uploadToGcs = (req, res, next) => {
    if (!req.file) return next()

    const gcsname = dateFormat(new Date(), "yyyymmdd-HHMMss")
    const file = bucket.file(`${folder}/${gcsname}`)

    const stream = file.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    })

    stream.on('error', (err) => {
        req.file.cloudStorageError = err
        next(err)
    })

    stream.on('finish', () => {
        req.file.cloudStorageObject = gcsname
        req.file.cloudStoragePublicUrl = getPublicUrl(gcsname)
        next()
    })

    stream.end(req.file.buffer)
}

// fungsi untuk menghapus file di Google Cloud Storage
ImgUpload.deleteFromGcs = (filename) => {
    if (filename) {
        const file = bucket.file(`${folder}/${filename}`)
        file.delete()
    }
}

module.exports = ImgUpload