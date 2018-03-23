'use strict'

const fs = require('fs')
const path = require('path')

const dir = path.resolve(__dirname, '../define')

module.exports = {
  // 需要识别的文法文件，需填写完整路径
  grammerFiles: [
    ...fs.readdirSync(dir).map(file => path.resolve(dir, file))
  ]
}