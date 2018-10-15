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

            superAgent(config.request.method, config.request.url.replace('{{id1}}', id[0].toString()).replace('{{id2}}', id[1].toString()).replace('{{id3}}', id[2].toString()))
                .set(headers)
                .buffer(true) // must
                .redirects(config.request.redirects)
                .query(config.request.query)
                .send(config.request.send)
                .end(async (err, result) => {
                    const log = logger.getLogger(id.toString()); // 日志

                    let newArray = [];

                    if (err) {
                        log.error(err);
                    }
                    else {
                        // let $ = cheerio.load(result.text);

                        log.debug(result.text);

                        // main
                        let jsonp = obj => {
                            let resultArray = obj.result;

                            for (let item of resultArray) {
                                newArray.push({
                                    id: item[0],
                                    name: item[1],
                                    sub: []
                                });
                            }

                            log.info(newArray);
                        };

                        // exec
                        eval(result.text);

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

                        callback(null, newArray);

                    }, config.delay);
                });

        }, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result[0]);
            }
        });
    });
};