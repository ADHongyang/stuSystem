const express = require('express')
const bodyParser = require('body-parser')
const template = require('art-template')

const app = express()

template.config('cache', false)
app.engine('html', template.__express)
app.set('view engine', 'html')

app.use(express.static('public'))
app.use(bodyParser.urlencoded({ extended: true }))

app.use('/api/index', require('./routes/api/index'))
app.use('/api/student', require('./routes/api/student'))
app.use('/edit', require('./routes/edit'))
app.use('/add', require('./routes/add'))
app.use('/', require('./routes/index'))


app.listen(3000, () => console.log('正在运行...'))