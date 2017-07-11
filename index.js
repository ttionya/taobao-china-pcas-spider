import "babel-polyfill";
import fs from 'fs';
import superAgent from 'superagent';
// import cheerio from 'cheerio';
// import { mapLimit } from 'async';
import fetch from './libs/fetch';
import logger from './libs/logger';
import config from './config';


// 省份信息
let provinces = [
    { id: '340000', name: '安徽省', sub: [] },
    { id: '110000', name: '北京市', sub: [] },
    { id: '500000', name: '重庆市', sub: [] },
    { id: '350000', name: '福建省', sub: [] },
    { id: '620000', name: '甘肃省', sub: [] },
    { id: '440000', name: '广东省', sub: [] },
    { id: '450000', name: '广西壮族自治区', sub: [] },
    { id: '520000', name: '贵州省', sub: [] },
    { id: '460000', name: '海南省', sub: [] },
    { id: '130000', name: '河北省', sub: [] },
    { id: '230000', name: '黑龙江省', sub: [] },
    { id: '410000', name: '河南省', sub: [] },
    { id: '420000', name: '湖北省', sub: [] },
    { id: '430000', name: '湖南省', sub: [] },
    { id: '320000', name: '江苏省', sub: [] },
    { id: '360000', name: '江西省', sub: [] },
    { id: '220000', name: '吉林省', sub: [] },
    { id: '210000', name: '辽宁省', sub: [] },
    { id: '150000', name: '内蒙古自治区', sub: [] },
    { id: '640000', name: '宁夏回族自治区', sub: [] },
    { id: '630000', name: '青海省', sub: [] },
    { id: '370000', name: '山东省', sub: [] },
    { id: '310000', name: '上海市', sub: [] },
    { id: '140000', name: '山西省', sub: [] },
    { id: '610000', name: '陕西省', sub: [] },
    { id: '510000', name: '四川省', sub: [] },
    { id: '120000', name: '天津市', sub: [] },
    { id: '650000', name: '新疆维吾尔自治区', sub: [] },
    { id: '540000', name: '西藏自治区', sub: [] },
    { id: '530000', name: '云南省', sub: [] },
    { id: '330000', name: '浙江省', sub: [] },
    { id: '710000', name: '台湾省', sub: [] },
    { id: '820000', name: '澳门特别行政区', sub: [] },
    { id: '810000', name: '香港特别行政区', sub: [] }
];

// 请求头信息
let configHeaders = config.headers,
    headers = {};

// 构造请求头信息
for (let key in configHeaders) {
    headers[key] = configHeaders[key];
}

// 获得信息
superAgent(config.request.method, 'https://g.alicdn.com/vip/address/6.0.5/index-min.js')
    .set(headers)
    .set({
        'Host': 'g.alicdn.com',
        'Accept': '*/*',
        'Referer': ''
    })
    .buffer(true) // must
    .redirects(config.request.redirects)
    .query(config.request.query)
    .send(config.request.send)
    .end(async (err, result) => {
        const log = logger('省市县信息'); // 日志

        if (err) {
            log.error(err);
        }
        else {
            // let $ = cheerio.load(result.text);

            const text = result.text;

            log.debug(text);

            // main
            for (let province of provinces) {
                let provinceId = province.id,
                    regCity = new RegExp('\\["(\\d+)",\\["([^"]+)","[^"]+"],"' + provinceId + '"(?:,"\\d+")?]', 'g'),
                    citys = text.match(regCity); // Get Citys

                // if not null
                if (citys) {
                    for (let city of citys) {
                        regCity.lastIndex = 0; // Reset Index
                        let matchedCity = regCity.exec(city),
                            cityId = matchedCity[1],
                            regArea = new RegExp('\\["(\\d+)",\\["([^"]+)","[^"]+"],"' + cityId + '"(?:,"\\d+")?]', 'g'),
                            areas = text.match(regArea),
                            cityArray = [];

                        // if not null
                        if (areas) {
                            let areaIdArray = [];

                            for (let area of areas) {
                                regArea.lastIndex = 0; // Reset Index
                                let matchedArea = regArea.exec(area),
                                    areaId = matchedArea[1];

                                // 已存在，继续下个循环
                                if (areaIdArray.indexOf(areaId) !== -1) {
                                    continue;
                                }

                                areaIdArray.push(areaId);

                                // 请求接口得到数组
                                let areaArray = await fetch([[
                                    provinceId,
                                    cityId,
                                    areaId
                                ]]);

                                // Add Area Data
                                cityArray.push({
                                    id: areaId,
                                    name: matchedArea[2],
                                    sub: areaArray
                                });
                            }
                        }

                        // Add City Data
                        province.sub.push({
                            id: cityId,
                            name: matchedCity[2],
                            sub: cityArray
                        });
                    }
                }
            }

            log.info(provinces);

            fs.writeFileSync('file.json', JSON.stringify(provinces));

            log.info('完成');
        }
    });