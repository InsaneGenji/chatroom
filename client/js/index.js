(function () {
    const url = 'ws://47.103.219.163:1552'; // 连接通信服务器
    let ws = new WebSocket(url);
    const register = document.querySelector('.register');
    const input = document.querySelector('.register input');
    const rbtn = document.querySelector('.register button');
    const figure = document.querySelector('figure');
    const section = document.querySelector('section');
    const tx = document.querySelector('textarea');
    const sbtn = document.querySelector('figure figcaption button');
    const aside = document.querySelector('figure aside');
    let username = null;
    input.value = '';
    tx.value = '';
    // 登录
    input.onkeydown = function (ev) {
        if (ev.keyCode === 13) {
            login();
        }
    };
    rbtn.onclick = function () {
        login();
    };
    function login() {
        flag = true;
        username = input.value;
        ws.send(`${username}`);
        register.style.display = 'none';
        figure.style.display = 'block';
    }



    // 聊天室
    // 发送消息
    sbtn.onclick = function () {
        sendmsg();
    };
    tx.onkeydown = function (ev) {
        if (ev.keyCode === 13) {
            sendmsg();
            return false;
        }
    };
    function sendmsg() {
        ws.send(`{"username":"${username}","word":"${tx.value}"}`);
        tx.value = "";
    };
    // 后台数据渲染
    ws.onmessage = function (ev) {
        let time = new Date().toLocaleString();
        let arrdata = ev.data.split(';');
        // 上下线
        if (arrdata[0].indexOf('username') === -1 && arrdata[0].indexOf('word') === -1 && arrdata[0].indexOf('{}') === -1) {
            if (arrdata[0] != 1001 && arrdata[0] != 1006 && arrdata[0] !== '用户名重复，请重新登录') {
                section.innerHTML += `<div class="online">${time}&nbsp;&nbsp;${arrdata[0]}&nbsp;&nbsp;上线了</div>`;
                updown(arrdata);
            } else if (arrdata[0] === '用户名重复，请重新登录') {
                alert('用户名重复，请重新登录');
                location.reload([true]);
            } else {
                section.innerHTML += `<div class="online">${time}&nbsp;&nbsp;${arrdata[2]}&nbsp;&nbsp;下线了</div>`;
                updown(arrdata);
            };
            section.scrollTop = section.scrollHeight;
            // 发消息
        } else {
            // 判断消息是自己发的还是其他人发的
            const message = JSON.parse(arrdata[0]);
            if (message.username === username) {
                section.innerHTML += `<li class='myself'>
                    <img src="img/miku.png" alt="">
                    <div class="username">
                        ${time}
                        &nbsp;&nbsp;
                        ${message.username}
                    </div>
                    <div class="content">
                        ${message.word}
                    </div>
                </li>`;
            } else {
                section.innerHTML += `<li class='others'>
                    <img src="img/miku.png" alt="">
                    <div class="username">
                        ${message.username}
                        &nbsp;&nbsp;
                        ${time}
                    </div>
                    <div class="content">
                        ${message.word}
                    </div>
                </li>`;
            };
            section.scrollTop = section.scrollHeight;
        }
    };
    // 右侧用户列表渲染
    function updown(arrdata) {
        let namelist = '';
        for (let i in JSON.parse(arrdata[1])) {
            namelist += `<li>
                <img src="img/miku.png" alt="">
                <p>${JSON.parse(arrdata[1])[i]}</p>
            </li>`;
        };
        aside.innerHTML = namelist;
    }
    // 下线
    ws.onclose = function () {
        ws.send(`古娜拉黑暗之神——呜呼拉呼——黑魔变身`);
    };
})()