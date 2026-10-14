/* 由餐厅信息表生成。可继续在 editor.html 中编辑。 */
const RESTAURANTS = [
  {
    "id": "r01",
    "name": "贯贯吉·清真餐厅",
    "category": "新疆菜",
    "location": "黄浦区 · 浙江中路70号",
    "price": "人均 ¥128",
    "time": "晚餐",
    "description": "藏在梧桐树下的小馆，酸辣清爽，适合慢慢吃一顿很长的晚餐。",
    "tags": [
      "汽锅鸡",
      "野生菌",
      "安静"
    ],
    "recommendedDishes": [
      {
        "name": "大漠烤羊排",
        "image": "images/dishes/r01-dish-01.jpg",
        "emoji": "🍲"
      },
      {
        "name": "大盘鸡",
        "image": "images/dishes/r01-dish-02.jpg",
        "emoji": "🍄"
      },
      {
        "name": "八宝茶",
        "image": "images/dishes/r01-dish-03.jpg",
        "emoji": "🥘"
      },
      {
        "name": "手抓羊排",
        "image": "images/dishes/r01-dish-04.jpg",
        "emoji": "🌿"
      }
    ],
    "dianpingUrl": "https://m.dianping.com/shopinfo/k85LtrjNWMlCCZ3x?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=3243&cityid=1&isoversea=0",
    "scores": {
      "distance": 4,
      "taste": 5,
      "novelty": 4,
      "ebao": 4
    },
    "image": "images/covers/r01-cover.jpg",
    "emoji": "🌿",
    "colors": [
      "#566246",
      "#b7a071"
    ]
  },
  {
    "id": "r02",
    "name": "胜记广州大排档",
    "category": "广州菜",
    "location": "普陀区 · 宁夏路236弄2号",
    "price": "人均 ¥86",
    "time": "午餐 / 晚餐",
    "description": "复古但不吵闹，菠萝油和咖喱牛腩很稳，临时起意也适合去。",
    "tags": [
      "菠萝油",
      "咖喱牛腩",
      "不排队"
    ],
    "recommendedDishes": [
      {
        "name": "老式电饭煲焗文昌鸡",
        "image": "images/dishes/r02-dish-01.jpg",
        "emoji": "🍞"
      },
      {
        "name": "金牌蒜香骨",
        "image": "images/dishes/r02-dish-02.jpg",
        "emoji": "🍛"
      },
      {
        "name": "烤乳鸽",
        "image": "images/dishes/r02-dish-03.jpg",
        "emoji": "🍋"
      },
      {
        "name": "干炒牛河",
        "image": "images/dishes/r02-dish-04.jpg",
        "emoji": "🍽️"
      }
    ],
    "dianpingUrl": "https://m.dianping.com/shopinfo/G98KAPpW7xJRkoGI?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=34283&cityid=1&isoversea=0",
    "scores": {
      "distance": 3,
      "taste": 5,
      "novelty": 3,
      "ebao": 3
    },
    "image": "images/covers/r02-cover.jpg",
    "emoji": "🥢",
    "colors": [
      "#8b3f35",
      "#d8a657"
    ]
  },
  {
    "id": "r03",
    "name": "梧桐·北京烤鸭·融合菜",
    "category": "北京菜",
    "location": "宝山区 · 菊泉街676号",
    "price": "人均 ¥105",
    "time": "午餐",
    "description": "木质小店，菜单不多但每样都认真。适合周末睡醒后去吃的一餐。",
    "tags": [
      "烤青花鱼",
      "定食",
      "窗边座位"
    ],
    "recommendedDishes": [
      {
        "name": "招牌梧桐脆皮烤鸭",
        "image": "images/dishes/r03-dish-01.jpg",
        "emoji": "🐟"
      },
      {
        "name": "低温慢烤牛肋骨",
        "image": "images/dishes/r03-dish-02.jpg",
        "emoji": "🍳"
      },
      {
        "name": "椒盐鸭架",
        "image": "images/dishes/r03-dish-03.jpg",
        "emoji": "🥣"
      },
      {
        "name": "",
        "image": "images/dishes/r03-dish-04.jpg",
        "emoji": "🍽️"
      }
    ],
    "dianpingUrl": "https://m.dianping.com/shopinfo/H1rDU92V3uR4Vhzx?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=1785&cityid=1&isoversea=0",
    "scores": {
      "distance": 2,
      "taste": 4,
      "novelty": 3,
      "ebao": 3
    },
    "image": "images/covers/r03-cover.jpg",
    "emoji": "🍚",
    "colors": [
      "#89735a",
      "#d5c5a5"
    ]
  },
  {
    "id": "r04",
    "name": "福苗小骆驼烧烤",
    "category": "烧烤·西安菜",
    "location": "浦东新区 · 浦东南路1101号",
    "price": "人均 ¥168",
    "time": "晚餐",
    "description": "开放式窑炉和薄底披萨，适合多人分享，也适合点一杯酒聊到很晚。",
    "tags": [
      "窑炉披萨",
      "自然酒",
      "适合分享"
    ],
    "recommendedDishes": [
      {
        "name": "烤肉筋",
        "image": "images/dishes/r04-dish-01.jpg",
        "emoji": "🍕"
      },
      {
        "name": "手撕烤羊排",
        "image": "images/dishes/r04-dish-02.jpg",
        "emoji": "🥬"
      },
      {
        "name": "蒜瓣烤牛肉",
        "image": "images/dishes/r04-dish-03.jpg",
        "emoji": "🍰"
      },
      {
        "name": "",
        "image": "images/dishes/r04-dish-04.jpg",
        "emoji": "🍽️"
      }
    ],
    "dianpingUrl": "https://m.dianping.com/shopinfo/H59Abg116pPiCWxx?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=4449&cityid=1&isoversea=0",
    "scores": {
      "distance": 5,
      "taste": 4,
      "novelty": 3,
      "ebao": 4
    },
    "image": "images/covers/r04-cover.jpg",
    "emoji": "🍕",
    "colors": [
      "#6e3028",
      "#c97852"
    ]
  },
  {
    "id": "r05",
    "name": "半山腰·云南菜",
    "category": "云南菜",
    "location": "浦东新区 · 东育路500弄",
    "price": "人均 ¥138",
    "time": "午餐 / 晚餐",
    "description": "椰子鸡清甜，配菜丰富。空间宽松，很适合几个人一起聚餐。",
    "tags": [
      "椰子鸡",
      "清淡",
      "聚餐"
    ],
    "recommendedDishes": [
      {
        "name": "武定母鸡炖菌汤",
        "image": "images/dishes/r05-dish-01.jpg",
        "emoji": "🥥"
      },
      {
        "name": "干皱椒炒牛干巴",
        "image": "images/dishes/r05-dish-02.jpg",
        "emoji": "🍄"
      },
      {
        "name": "鲜花饼",
        "image": "images/dishes/r05-dish-03.jpg",
        "emoji": "🍚"
      },
      {
        "name": "包浆豆腐",
        "image": "images/dishes/r05-dish-04.jpg",
        "emoji": "🍽️"
      }
    ],
    "dianpingUrl": "https://m.dianping.com/shopinfo/l6D1G7ytwFw8Dj8G?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=248&cityid=1&isoversea=0",
    "scores": {
      "distance": 4,
      "taste": 3,
      "novelty": 5,
      "ebao": 3
    },
    "image": "images/covers/r05-cover.jpg",
    "emoji": "🥥",
    "colors": [
      "#32766a",
      "#d4bd72"
    ]
  },
  {
    "id": "r06",
    "name": "呼伦一只牛·烤串酒场",
    "category": "烧烤",
    "location": "浦东新区 · 商城路518号",
    "price": "人均 ¥220",
    "time": "晚餐 / 宵夜",
    "description": "小而热闹的夜间食堂，串烧火候很好，适合把一周的疲惫留在这里。",
    "tags": [
      "提灯",
      "鸡肉丸",
      "宵夜"
    ],
    "recommendedDishes": [
      {
        "name": "牛肋条",
        "image": "images/dishes/r06-dish-01.jpg",
        "emoji": "🏮"
      },
      {
        "name": "羊肉串",
        "image": "images/dishes/r06-dish-02.jpg",
        "emoji": "🍢"
      },
      {
        "name": "叫花鸡架",
        "image": "images/dishes/r06-dish-03.jpg",
        "emoji": "🔥"
      },
      {
        "name": "",
        "image": "images/dishes/r06-dish-04.jpg",
        "emoji": "🍚"
      }
    ],
    "dianpingUrl": "https://m.dianping.com/shopinfo/EDan4kuEbLV4GUyx?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=4449&cityid=1&isoversea=0",
    "scores": {
      "distance": 5,
      "taste": 5,
      "novelty": 3,
      "ebao": 5
    },
    "image": "images/covers/r06-cover.jpg",
    "emoji": "🔥",
    "colors": [
      "#202329",
      "#ad533d"
    ]
  },
  {
    "id": "r07",
    "name": "顺峰顺水顺德菜",
    "category": "顺德菜",
    "location": "黄浦区 · 南京东路800号",
    "price": "人均 ¥145",
    "time": "午餐 / 晚餐",
    "description": "藏在老洋房里的清新小院，香料明亮，适合天气好的周末。",
    "tags": [
      "冬阴功",
      "青木瓜沙拉",
      "小院"
    ],
    "recommendedDishes": [
      {
        "name": "脆皮乳鸽",
        "image": "images/dishes/r07-dish-01.jpg",
        "emoji": "🍲"
      },
      {
        "name": "顺德滑鸡丝瓜",
        "image": "images/dishes/r07-dish-02.jpg",
        "emoji": "🥗"
      },
      {
        "name": "干蒸排骨",
        "image": "images/dishes/r07-dish-03.jpg",
        "emoji": "🥩"
      },
      {
        "name": "沙葱炒吊龙",
        "image": "images/dishes/r07-dish-04.jpg",
        "emoji": "🥭"
      }
    ],
    "dianpingUrl": "https://m.dianping.com/shopinfo/G9tXJFd58XK3EagC?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=2808&cityid=1&isoversea=0",
    "scores": {
      "distance": 4,
      "taste": 5,
      "novelty": 4,
      "ebao": 4
    },
    "image": "images/covers/r07-cover.jpg",
    "emoji": "🌴",
    "colors": [
      "#2f6f62",
      "#d1b866"
    ]
  },
  {
    "id": "r08",
    "name": "航迹厨房 Merchant Kitchen",
    "category": "自助餐",
    "location": "浦东新区 · 浦明路988号",
    "price": "人均 ¥260",
    "time": "晚餐",
    "description": "开放式厨房和季节菜单，适合想认真庆祝一下的特别晚餐。",
    "tags": [
      "牛排",
      "黑松露",
      "纪念日"
    ],
    "recommendedDishes": [
      {
        "name": "",
        "image": "images/dishes/r08-dish-01.jpg",
        "emoji": "🍚"
      },
      {
        "name": "",
        "image": "images/dishes/r08-dish-02.jpg",
        "emoji": "🥩"
      },
      {
        "name": "",
        "image": "images/dishes/r08-dish-03.jpg",
        "emoji": "🍗"
      },
      {
        "name": "",
        "image": "images/dishes/r08-dish-04.jpg",
        "emoji": "🍫"
      }
    ],
    "dianpingUrl": "https://m.dianping.com/shopinfo/G7EqS3ZToiOupdHx?msource=Appshare2021&utm_source=shop_share&shoptype=10&shopcategoryid=111&cityid=1&isoversea=0",
    "scores": {
      "distance": 4,
      "taste": 4,
      "novelty": 5,
      "ebao": 4
    },
    "image": "images/covers/r08-cover.jpg",
    "emoji": "🍷",
    "colors": [
      "#29262d",
      "#8d5d51"
    ]
  }
];
