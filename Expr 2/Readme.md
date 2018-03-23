# 编译原理 实验二

作者: 江子豪

## 环境要求

- [NodeJS](https://nodejs.org) v8.0 及以上

## 项目结构

```plain
/
  /define         - grammer files for test
  /src
    /lib
      grammer.js  - Grammer definition
    config.js     - configuration
    index.js      - entry point
```

## 启动方法

`$ node src/index`

## 添加或删除文法

修改`src/config.js`，在`module.exports.grammerFiles`下添加文件的绝对路径或删除