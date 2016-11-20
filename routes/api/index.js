const express = require('express')
const student = require('../../mongoose')

const router = express.Router()

//api/index/2
router.post('/:pagesize/(:page)?', (req, res) => {
    // 用来给查询设置条件，会使用在后面使用的find()中
    var filter = {}

    // 张三   张三
    var name = req.body.name
    if (name) { //搜索条件name中有值时加入name筛选
        name = name.trim() //''
        if (name.length > 0) {   
            filter.name = { 
                '$regex': `.*?${name}.*?`
                // 数据库中的name属性中包含查询的字符串name
                // 正则表达式：
                // .表示除回车换行外的任意字符
                // *表示0个或多个
                // ?表示可以有也可以没有
            }
        }
    }

    var sex = req.body.sex //注意取的值类型是字符串
    if (sex) {
        sex = sex.trim()
        if (sex.length > 0) {
            filter.sex = (sex == 'true')
        }
    }

    var phone = req.body.phone
    if (phone) {
        phone = phone.trim()
        if (phone.length > 0) {
            filter.phone = {
                '$regex': `.*?${phone}.*?`
            }
        }
    }

    

    // 注意类型是number
    // 以前的方法都是通过URL传过来的 get请求
    // 本次实现的是通过$.post()的URL参数传送过来的 POST请求
    var page = isNaN(req.params.page) 
    ? 1 
    : parseInt(req.params.page)

    // 取每页显示的数据个数
    var pageSize = isNaN(req.params.pagesize) 
    ? 1 
    : parseInt(req.params.pagesize)

    // find({name:{$regex:'.*?张三.*?'},sex: true, phone:{$regex:'.*?135.*?'}})
    student.find(filter).count((err, total) => {
        if (err) {
            res.json({ code: 'error', message: '系统错误！' })
            return;
        }
        
        //总页数  集合中记录数/每页的数量
        var pageCount = Math.ceil(total / pageSize)

        if (page > pageCount) page = pageCount
        if (page < 1) page = 1

        student.find(filter)
            .sort({ createTime: -1 }) // 排序，按创建日期倒序排列，可保证最后添加的数据在第一行显示
            .skip((page - 1) * pageSize) // 跨过
            .limit(pageSize) // 限制取记录数
            .select('name sex age phone email') //用来过滤在前台显示的属性（字段）
            .exec((err, data) => {
                if (err) {
                    res.json({ code: 'error', message: '系统错误！' })
                    return;
                }
                // res.render("index", data)
                res.json({
                    code: 'success', returnData: {
                        page,
                        pageCount,
                        pages: getPages(page, pageCount),
                        students: data.map(m => {
                            m = m.toObject()
                            m.id = m._id.toString()
                            delete m._id
                            return m
                        })
                    }
                })
            })
    })
})

// page当前页， pageCount 总页数
function getPages(page, pageCount) {
    var pages = [page] // [3]
    // 取当前页的前一个页面
    var left = page - 1  //2
    var right = page + 1 //4

//  100页 当前90 只让显示5个数字  [88,89,90,91,92]
    while (pages.length < 5 && (left >= 1 || right <= pageCount)) {
        if (left > 0) pages.unshift(left--)
        if (right <= pageCount) pages.push(right++)
    } 
   //[1,2,3,4]

    return pages
}


module.exports = router