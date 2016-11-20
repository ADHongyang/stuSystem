const express = require('express')
const student = require('../mongoose')

const router = express.Router()

router.get('/:id', (req, res) => {
    student.findById(req.params.id, (err, data) => {
        if (!err) {
            res.render('edit', { student: data })
        }
    })
})

module.exports = router