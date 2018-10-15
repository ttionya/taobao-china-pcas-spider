# 淘宝中国街道数据爬虫

从淘宝爬取全中国省、市、县、街道数据。

**爬取时间：2018.10.16**

### 数据结构

```json
[
  {
    "id": "340000",
    "name": "安徽省",
    "sub": [
      {
        "id": "340100",
        "name": "合肥",
        "sub": [
          {
            "id":"340102",
            "name":"瑶海",
            "sub": [
              {
                "id":"340102001",
                "name":"明光路街道",
                "sub":[]
              },
              {
                "id":"340102002",
                "name":"车站街道",
                "sub":[]
              }
            ]
          }
        ]
      }
    ]
  }
]
```

### 地址：
- [https://g.alicdn.com/vip/address/6.1.1/index-min.js](https://g.alicdn.com/vip/address/6.1.1/index-min.js)
- [https://lsp.wuliu.taobao.com/locationservice/addr/output_address_town_array.do?l1=110000&l2=110100&l3=110101&lang=zh-S&callback=jsonp7524](https://lsp.wuliu.taobao.com/locationservice/addr/output_address_town_array.do?l1=110000&l2=110100&l3=110101&lang=zh-S&callback=jsonp7524)

发现现在淘宝地址使用[这个](https://division-data.alicdn.com/simple/addr_4_1111_1_0.js)地址获得国、省、市、县数据，后续可以修改。

### 其他参考

- [Administrative-divisions-of-China](https://github.com/modood/Administrative-divisions-of-China)
- [国家统计局](http://www.stats.gov.cn/tjsj/tjbz/tjyqhdmhcxhfdm/)
- [民政部](http://www.mca.gov.cn/article/sj/tjbz/a/)

### 许可证

MIT
