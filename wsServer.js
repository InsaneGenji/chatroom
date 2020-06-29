const webSocket = require('ws');
const server = new webSocket.Server({ //创建一个ws服务对象
    port: 1552,
    host: '172.17.26.65'
});
let users = {};
let count = 0;
let namelist = {};
server.on("connection", client => {
    let repeatflag = false;
    let flag = false;
    client.on("message", msg => {
        let time = new Date().toLocaleString();
        flag = true;
        if (msg.indexOf('username') === -1 && msg.indexOf('msg') === -1 && msg.indexOf('{}') === -1) {
            for (let i in namelist) {
                if (namelist[i] === msg) {
                    repeatflag = true;
                    client.send('用户名重复，请重新登录');
                    break;
                }
            };
            if (!repeatflag) {
                client.username = msg;
                users[client.username] = client;
                namelist[count] = users[client.username].username;
                count++;
                console.log(`${time} ${users[client.username].username} 上线了`);
            }
        } else {
            if (!repeatflag) {
                console.log(`${time} ${JSON.parse(`${msg}`).username} 说：${JSON.parse(`${msg}`).word}`);
            }
        }
        if (!repeatflag) {
            boardCaster(msg, users[client.username].username);
        }
    });
    client.on('close', msg => {
        let time = new Date().toLocaleString();
        if (flag && !repeatflag) {
            for (let i in namelist) {
                if (namelist[i] === users[client.username].username) {
                    console.log(`${time} ${users[client.username].username} 下线了`);
                    delete namelist[i];
                }
            };
            boardCaster(msg, users[client.username].username);
        }
    })
});
function boardCaster(msg, selfname) {
    for (let key in users) {
        users[key].send(`${msg};${JSON.stringify(namelist)};${selfname}`);
    }
}