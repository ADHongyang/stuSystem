const mongoose = require('mongoose')

mongoose.connect('mongodb://localhost/zy-students')
const db = mongoose.connection

db.on('error', err => console.error('数据连接失败：', err))
db.on('open', () => console.log('打开数据库连接'))

const student = mongoose.model('students', {
    name: String,
    sex: Boolean,
    age: Number,
    phone: String,
    email: String,
    description: String,
    ip: String,
    createTime: Date,
    updateTime: Date
})

module.exports = student