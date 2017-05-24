import log4js from 'log4js';
import config from '../config';


export default name => {
    "use strict";

    // 配置项
    let logConfig = {
        appenders: [{
            type: 'console'
        }],
        replaceConsole: true
    };

    // 保存到文件
    config.log4js.logFile && logConfig.appenders.push({
        type: 'file',
        filename: config.log4js.logFile,
        maxLogSize: 1024,
        backups:4,
        category: name
    });

    // 应用配置文件
    log4js.configure(logConfig);


    let log = log4js.getLogger(name);

    // 设置日志等级
    log.setLevel(config.log4js.logLevel);

    return log;
};