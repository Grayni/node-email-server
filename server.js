const express = require('express')
const nodemailer = require('nodemailer')
const bodyParser = require('body-parser')
const fs = require('fs')
const configure = JSON.parse(fs.readFileSync('./.config.json'))

const app = express()

// Body parser middleware
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

let transporter = nodemailer.createTransport({
  service: 'gmail',
  secure: false,
  port: 25,
  auth: {
    user: 'example@gmail.com',
    pass: configure.pass
  },
  tls: {
    rejectUnauthorized: false
  }
})

app.post('/', (req, res) => {
  let name = 'Имя пользователя: ' + req.body.name
  let phone = 'Номер телефона: ' + req.body.phone

  let HelperOptions = {
    from: '"Пользователь с сайта" <example@gmail.com>',
    to: 'example@gmail.com',
    subject: 'Просьба перезвонить!',
    text: name + '\n' + phone
  }

  if (req.body.name.length === 0 || req.body.phone.length === 0) {
    res.end(JSON.stringify(2))
    return false
  } else {
    transporter.sendMail(HelperOptions, (err, info) => {
      if (err) console.log(err)
    })
    res.end(JSON.stringify(1))
  }
})

app.post('http://localhost', (req, res) => console.log(req.body))

app.listen(3000, () => console.log('server on port: 3000'))
