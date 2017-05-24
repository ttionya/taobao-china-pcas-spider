export default {

    // 请求相关内容
    request: {

        // 方法：HEAD、GET、POST、PUT、DEL
        method: 'GET',

        // 待爬取的 URL，带参数的用 {{id}} 替换
        url: '{{id}}',

        // 查询参数，常用于 GET
        // a=1&b=2
        // { a: 1, b: 2 }
        query: '',

        // 发送数据，常用于 POST
        // a=1&b=1
        // { a: 1, b: 2 }
        send: '',

        // 跟随重定向数量
        redirects: 5
    },


    // 请求的头部信息，每个内容都会原样输入
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Encoding': 'gzip, deflate, sdch',
        'Cookie': '',
        'Host': '',
        'Referer': '',
        'DNT': 1,
        'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/57.0.2987.98 Safari/537.36'
    },


    // 并发数，过高会被当作攻击，建议 20 - 30
    limit: 30,

    // 每次请求延迟时间，以 ms 计算
    delay: 0,


    // log4js
    log4js: {

        // 日志等级：OFF FATAL ERROR WARN INFO DEBUG TRACE ALL
        logLevel: 'INFO',

        // 保存到文件
        // 置空表示不保存，放在 logs 文件夹里
        logFile: 'logs/logs.log'
    }
}