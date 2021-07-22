const express = require('express')
const router = express.Router()
const path = require('path')
const multer = require("multer")

function getFileName(file){
    const rn = Math.floor(Math.random() * 90000000) + 10000000
    return 'image_' + rn + Date.now() + path.extname(file.originalname)
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        req.userpicPath = '/images/profile_pictures'
        cb(null, path.resolve(__dirname, '../public/images/profile_pictures'))
    },
    filename: (req, file, cb) => {
        req.userpicFilename = getFileName(file)
        cb(null, req.userpicFilename)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 1024 ** 2},
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname)


        

        if(['.jpg', '.png', '.jpeg'].includes(ext)){
            console.log("Filename", file.originalname)
            cb(null, true)
        } else {
            const err = new Error('Extenton error')
            err.code = 'EXTENTION'
            cb(err)
        }
    }
}).single('userpic')


router.post('/image', (req, res) => {
    upload(req, res, err => {
        console.log("Resolve a picture")
        if(err){
            console.log(err);
            if(err.code == 'LIMIT_FILE_SIZE')
                res.json({status: false, message: 'Image size should not exceed 1 mb'})
            
            if(err.code == 'EXTENTION')
                res.json({status: false, message: 'Unsupported file type'})
        } else {
            res.json({
                status: true, 
                message: 'Image loaded', 
                link: path.resolve(req.userpicPath, req.userpicFilename)
            })
        }
    })
})

module.exports = router;