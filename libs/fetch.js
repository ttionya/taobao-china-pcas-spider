import superAgent from 'superagent';
import cheerio from 'cheerio';
import { mapLimit } from 'async';
import download from 'download';
import config from '../config';

export default (array) => {
    return new Promise((resolve, reject) => {

        let concurrencyCount = 0,   // 并发数
            configHeaders = config.headers,
            headers = {};           // 请求头信息

        // 构造请求头信息
        for (let key in configHeaders) {
            headers[key] = configHeaders[key];
        }

        mapLimit(array, config.limit, (id, callback) => {

            // 并发数计数器 +1s
            concurrencyCount++;

            superAgent(config.request.method, config.request.url.replace('{{id}}', id.toString()))
                .set(headers)
                .redirects(config.request.redirects)
                .query(config.request.query)
                .send(config.request.send)
                .end((err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    else {
                        let $ = cheerio.load(result.text);

                        console.log(result);
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