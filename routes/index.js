const express = require('express')
const student = require('../mongoose')

const router = express.Router()

// :page 点位符 ? 代表点位符可有可无
router.get('/(:page)?', (req, res) => {
    // var page = req.params.page || 1
    // if (isNaN(page)) {
    //     page = 1
    // }
    // page = parseInt(page)

    //  isNaN 用来判断参数是否是NaN,是返回true，不是返回false
    var page = isNaN(req.params.page)
        ? 1 : parseInt(req.params.page);

    var pageSize = 2

    student.find().count((err, total) => {

        if (err) {
            res.render('index', {
                page: 1,
                pageCount: 1,
                students: []
            })
            return;
        }

        //取总页数  用数据的总数/每页显示的个数 向上取整
        var pageCount = Math.ceil(total / pageSize)

        student.find()
            .skip((page - 1) * pageSize)//跳过N条记录向下取
            .limit(pageSize) //限制取多少条
            .select('name sex age phone email') //筛选要显示的列
            .exec((err, data) => {
                if (err) {
                    res.render('index', {
                        page: 1,
                        pageCount: 1,
                        students: []
                    })
                    return;
                }

                res.render('index', {
                    page, pageCount,
                    students: data
                })

            })
    })
})

module.exports = router