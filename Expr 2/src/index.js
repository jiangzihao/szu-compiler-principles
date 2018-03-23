'use strict'

// Grammer类
const Grammer = require('./lib/grammer')
// 设置文件中要读取的文法文本文件
const { grammerFiles } = require('./config')

const grammers = []

// 对所有指定的文件进行处理
for (const grammerFile of grammerFiles) {
  Grammer.resolveFile(grammerFile).then(grammer => { grammers.push(grammer); return grammer }).then(item => {
    function normalizeProductions (P, linePrefix = '') {
      let str = ""
      for (const key in P) {
        str += linePrefix + key + ' -> ' + P[key].join(' | ') + '\n'
      }
      return str.slice(0, str.length - 1)
    }

    // 输出四元组信息
    console.log(`G(V, T, P, S)`)
    console.log(`  V: ${item.V.join(', ')}`)
    console.log(`  T: ${item.T.join(', ')}`)
    console.log('  P:')
    console.log(normalizeProductions(item.P, '     '))
    console.log(`  S: ${item.S}`)
    console.log(`  type: ${Grammer.typeMap[item.getType()]}\n`)
  })
}