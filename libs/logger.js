import log4js from 'log4js';
import config from '../config';


export default (() => {
    "use strict";

    // 配置项
    let logConfig = {
        appenders: {
            console: {
                type: 'console'
            }
        },
        categories: {
            default: {
                appenders: ['console'],
                level: config.log4js.logLevel // 设置日志等级
            }
        }
    };

    // 保存到文件
    if (config.log4js.logFile) {
        logConfig.appenders.file = {
            type: 'file',
            filename: config.log4js.logFile,
            maxLogSize: 512 * 1024 * 1024, // 512M
            backups: 4
        };

        logConfig.categories.default.appenders.push('file');
    }

    // 应用配置文件
    log4js.configure(logConfig);

    return log4js;
})();