// 创建web服务
const express = require('express');
const path = require('path');
const app = express();
const port = 1551;
const host = '172.17.26.65';
// app.use() 使用中间件
// express.static 让目录暴露给前端
app.use(express.static(path.join(__dirname, 'client')));
app.listen(port, host, () => {
    console.log(`server is running on http://${host}:${port}`);
});