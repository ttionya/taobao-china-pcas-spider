import fs from 'fs';
import superAgent from 'superagent';
import cheerio from 'cheerio';
import { mapLimit } from 'async';
import download from 'download';
import config from '../config';
import logger from './logger';


export default array => {
    return new Promise((resolve, reject) => {

        let concurrencyCount = 0,   // 并发数
            configHeaders = config.headers,
            headers = {};           // 请求头信息

        // 构造请求头信息
        for (let key in configHeaders) {
            headers[key] = configHeaders[key];
        }


        // 当开启下载功能时，创建 dist 文件夹
        if (config.download) {
            try {
                fs.accessSync('dist', fs.F_OK);
            }
            catch (e) {
                fs.mkdirSync('dist');
            }
        }


        // TODO
        // 这里做些什么

        mapLimit(array, config.limit, (id, callback) => {

            // 并发数计数器 +1s
            concurrencyCount++;

            superAgent(config.request.method, config.request.url.replace('{{id}}', id.toString()))
                .set(headers)
                .redirects(config.request.redirects)
                .query(config.request.query)
                .send(config.request.send)
                .end(async (err, result) => {
                    const log = logger(id.toString()); // 日志

                    if (err) {
                        log.error(err);
                    }
                    else {
                        let $ = cheerio.load(result.text);

                        log.info(result);

                        // TODO
                        // 这里做些什么

                        // 是否开启下载功能
                        if (config.download) {
                            await download(id)
                                .then(data => fs.writeFileSync('dist/file', data));
                        }
                    }


                    // 继续
                    setTimeout(function() {
                        // 并发数计数器反向 +1s
                        concurrencyCount--;

                        callback(null);

                    }, config.delay);
                });

        }, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
};