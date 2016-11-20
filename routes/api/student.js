const express = require('express')
const student = require('../../mongoose')
        
const router = express.Router()

router.post('/add', (req, res) => {
    req.body.ip = req.ip
    req.body.createTime = new Date()
    req.body.updateTime = req.body.createTime
    
    new student(req.body).save(err => {
        if(err){
            res.json({code: 'error', message: '系统错误'})
        }
        else{
            res.json({code: 'success', message: '成功！'})
        }
    })
})


router.post('/edit/:id', (req, res) => {
    req.body.ip = req.ip
    req.body.updateTime = new Date()
    
    student.findByIdAndUpdate(req.params.id, req.body, err => {
        if(err){
            res.json({code: 'error', message: '系统错误'})
        }
        else{
            res.json({code: 'success', message: '成功！'})
        }
    })
})

router.post('/remove/:id', (req, res) => {
    student.findByIdAndRemove(req.params.id, err => {
        if(err){
            res.json({code: 'error', message: '系统错误'})
        }
        else{
            res.json({code: 'success', message: '成功！'})
        }
    })
})

module.exports = router