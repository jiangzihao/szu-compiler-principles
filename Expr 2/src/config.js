'use strict'

const path = require('path')

module.exports = {
  // 需要识别的文法文件，需填写完整路径
  grammerFiles: [
    path.resolve(__dirname, '../define/0.txt'),
    path.resolve(__dirname, '../define/1.txt'),
    path.resolve(__dirname, '../define/2.txt'),
    path.resolve(__dirname, '../define/3.txt'),
    path.resolve(__dirname, '../define/lrg.txt'),
    path.resolve(__dirname, '../define/rrg.txt'),
  ]
}