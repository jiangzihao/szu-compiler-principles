'use strict'

const fs = require('fs')
const readline = require('readline')

class Grammer {
  constructor(V, T, P, S) {
    this.V = V
    this.T = T
    this.P = P
    this.S = S
  }

  static get typeMap() {
    return ['无限制文法', '上下文相关文法', '上下文无关文法', '正则文法', '正则文法(左线性文法)', '正则文法(右线性文法)']
  }

  // 获取文法类型
  getType() {
    // 当前判定的文法类型
    let type = 0
    const { V, T, P, S } = this
    // 获取所有产生式的左部
    const keys = Object.keys(P)
    
    // 判断产生式的右部长度是否都大于等于左部长度
    function allRightMoreThanLeft() {
      return keys.filter(key => P[key].filter(value => value.length < key.length).length > 0).length == 0
    }

    // 判断产生式的左部是否有长度大于1的
    function leftLengthMoreThan1 () {
      return keys.filter(i => i.length > 1).length > 0
    }

    // 判断产生式的右部是否满足正则文法的要求
    function regular() {
      // 若存在产生式右部长度元素数量大于2的产生式，则不满足
      if (keys.filter(key => P[key].filter(value => value.length > 2).length > 0).length > 0) return false
      
      for (const key of keys) {
        for (const value of P[key]) {
          const [first, second] = value
          // 若产生式右部只有一个元素，且该元素是非终结符则不满足
          if (second == undefined) {
            if (V.indexOf(first) >= 0) return false
            else continue
          }
          // 若有两个元素，则判断他们是否属于同一个集合，若是则不满足
          if (V.indexOf(first) >= 0 && V.indexOf(second) >= 0
            ||T.indexOf(first) >= 0 && T.indexOf(second) >= 0) {
            return false
          }
        }
      }

      return true
    }

    /**
     * 验证左右线性文法
     * @returns {Number} -1: 非正则文法, 0: 非左右线性文法, 1: 左线性文法, 2: 右线性文法
     */
    function leftRight () {
      let lr

      for (const key of keys) {
        for (const value of P[key]) {
          const [first, second] = value
          if (second == undefined) continue
          if (V.indexOf(first) >= 0) {
            if (lr == 2) return -1
            lr = 1
          } else {
            if (lr == 1) return -1
            lr = 2
          }
        }
      }

      return lr || 0
    }

    // 若右部长度都大于左部
    if (allRightMoreThanLeft()) {
      // CSG
      type = 1
      // 若左部的元素数量都为1
      if (!leftLengthMoreThan1()) {
        // CFG
        type = 2
        // 若满足正则文法要求
        if (regular()) {
          // RG
          type = 3
          // 判断是左线性还是右线性
          switch (leftRight()) {
            // 同时出现了左右两种性质，则不为正则文法，为CFG
            case -1:
              type = 2
              break
            // 左线性文法
            case 1:
              type = 4
              break
            // 右线性文法
            case 2:
              type = 5
              break
          }
        }
      }
    }

    return type
  }

  // 处理指定的文本文件
  static resolveFile (filePath) {
    // 返回一个异步操作
    return new Promise((resolve, reject) => {
      // 创建一个按行读取的文件输入流
      const rl = readline.createInterface(fs.createReadStream(filePath))
      // 四元组
      let V = [], T = [], P = {}, S
      // 识别模式
      let mode = 0
      // 识别标志符
      const modesReg = [/^\$Variable$/, /^\$Terminal$/, /^\$Production$/, /^\$Start Symbol$/]

      // 处理注释
      function removeComments(line) {
        return line.split('#')[0].trim()
      }

      // 将一行句子以指定的分隔符切割为数组并去除空串部分
      function splitLine (line, reg) {
        return line.split(reg).map(i => i.trim()).filter(i => i)
      }

      // 添加事件监听，按行读取文件
      rl.on('line', line => {
        // 去除注释
        line = removeComments(line)
        // 空行
        if (line.length == 0) return
        else if (line.startsWith('$')) { // 以$打头是标识符行
          // 识别对应的标识符并切换识别模式
          modesReg.forEach((reg, index) => {
            if (reg.test(line)) mode = index
          })
        } else {
          // 根据识别模式，进行不同的操作
          switch (mode) {
            // 非终结符
            case 0:
              V = V.concat(splitLine(line, ','))
              break
            // 终结符
            case 1:
              T = T.concat(splitLine(line, ','))
              break
            // 产生式
            case 2:
              const elements = splitLine(line, ',').map(i => {
                const [left, right] = splitLine(i, '->')
                return { left, right: splitLine(right, '|') }
              })

              for (const el of elements) {
                const { left, right } = el
                if (P[left]) {
                  P[left] = P[left].concat(right)
                } else {
                  P[left] = right
                }
              }

              break
            // 开始符号
            case 3:
              if (S == undefined) S = line.trim()
              else throw new Error("You cannot define more than 1 start symbol")
          }
        }
      })
      // 输入流关闭时，验证文法合法性，并结束异步操作
      rl.on('close', () => {
        // TODO: Verify grammer

        resolve(new Grammer(V, T, P, S))
      })
    })
  }
}

module.exports = Grammer