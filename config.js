/**
 * Created by bjcwq on 16/7/28.
 */
const env = process.env.NODE_ENV;

const productionConfig = {
    session_secret: 'cH38wtQAj9X672QgNUR0L7x5n1MNIh',
    cookie_max_age: 10 * 24 * 3600 * 1000,
    session_max_age: 10 * 24 * 3600,

    db: 'mongodb://Ranch:yunfarm_000@master.mongodb.aliyun.yunfarm.net/Ranch',

    redis: {
        port: 6379,
        host: 'redis.systemserver.aliyun.yunfarm.net',
        auth_pass: 'xcfjliQeWP'
    },
    wechat_store: {
        appid: 'wx35548ff0c793bc98',
        appsecret: '0b0e59db80aedcab7dea2e3e07601d59',
        ACCESSTOKEN_KEY: 'store_weixin_accessToken',
        JSAPITICKET_KEY: 'store_weixin_jsapiticket',
        token: 'store'
    },
    wechat_yunfarm: {
        appid: 'wx3c0ae0c79b50218d',
        appsecret: '5131601773ea5bb03fe216d500dd6bce',
        ACCESSTOKEN_KEY: 'ranch_weixin_accessToken',
        JSAPITICKET_KEY: 'ranch_weixin_jsapiticket',
        token: 'Ranch'
    },
    AliPushCfg: {
        url: 'http://shop-core.webserver.aliyun.yunfarm.net:18080/msc_notify/api/notify',
        appKey: '23372525'
    },
    wxTemplate: {
        INVITE_FRIENDS_INVEST: 'OPENTM204658409',
        INVEST_SHEEP: 'OPENTM204658409',
        UPGRADE: 'OPENTM401426285',
        LOTTERY_WIN_REWARD_PHYSICAL: 'OPENTM401684051',
        LOTTERY_WIN_REWARD_INTEGRAL: 'OPENTM204658409'
    },
    logServer: {
        host: 'log4js1.logserver.aliyun.yunfarm.net',
        port: 33333
    },
    logdir: './data/logs/' // 日志文件夹
};

// 测试环境
const functionalConfig = {
    db: 'mongodb://Ranch:yunfarm_000@101.201.197.163/Ranch1',
    redis: {
        port: 6379,
        host: '101.201.197.163',
        auth_pass: 'eGd3cEn38tYCQiDBzx7PTWwO'
    },
    AliPushCfg: {
        url: 'http://101.201.197.163:18080/msc_notify/api/notify',
        appKey: '23372525'
    },
    wechat_yunfarm: {
        appid: 'wx3efe1b5c964c16c3',
        appsecret: '9ef9c1bae9ebd899abeec6aea474b26f',
        // appid: 'wx3c0ae0c79b50218d',
        // appsecret: '5131601773ea5bb03fe216d500dd6bce',
        ACCESSTOKEN_KEY: 'ranch_weixin_accessToken',
        JSAPITICKET_KEY: 'ranch_weixin_jsapiticket',
        token: 'Ranch'
    },
    logServer: {
        host: '101.201.197.163',
        port: 33333
    }
};

//  开发环境
const devConfig = {
    //db: 'mongodb://Ranch:yunfarm_000@101.201.197.163/Ranch1',
    db: 'mongodb://127.0.0.1/koa-test',
    redis: {
        port: 6379,
        host: '101.201.197.163',
        auth_pass: 'eGd3cEn38tYCQiDBzx7PTWwO'
    },
    AliPushCfg: {
        url: 'http://101.201.197.163:18080/msc_notify/api/notify',
        appKey: '23372525'
    },
    wechat_yunfarm: {
        appid: 'wx3efe1b5c964c16c3',
        appsecret: '9ef9c1bae9ebd899abeec6aea474b26f',
        // appid: 'wx3c0ae0c79b50218d',
        // appsecret: '5131601773ea5bb03fe216d500dd6bce',
        ACCESSTOKEN_KEY: 'ranch_weixin_accessToken',
        JSAPITICKET_KEY: 'ranch_weixin_jsapiticket',
        token: 'Ranch'
    },
    wxTemplate: {
        INVITE_FRIENDS_INVEST: 'JBXXIpi3Hw58NY031B6g-na3Ye1RyM8Q_uXuPSaOgcc',
        INVEST_SHEEP: 'JBXXIpi3Hw58NY031B6g-na3Ye1RyM8Q_uXuPSaOgcc',
        UPGRADE: 'KPLEJsb1RSBSM3g9zd4qlAH00fZG3wIFIA86EpJOQbM	',
        LOTTERY_WIN_REWARD_PHYSICAL: 'KEBfS7QL9Lk-3s_8qG1PhrxcpcU7-85qERTUxLGSjoQ',
        LOTTERY_WIN_REWARD_INTEGRAL: 'JBXXIpi3Hw58NY031B6g-na3Ye1RyM8Q_uXuPSaOgcc'
    },
    logServer: {
        host: '101.201.197.163',
        port: 33333
    },
    logdir: `${__dirname}/logs/`
};

// 单元测试
const testConfig = {
    db: 'mongodb://admin:admin@101.201.197.163/Ranch-test',
    redis: {
        port: 6379,
        host: '101.201.197.163',
        auth_pass: 'eGd3cEn38tYCQiDBzx7PTWwO'
    },
    logServer: {
        host: '101.201.197.163',
        port: 33333
    },
    wxTemplate: {
        INVITE_FRIENDS_INVEST: 'JBXXIpi3Hw58NY031B6g-na3Ye1RyM8Q_uXuPSaOgcc',
        INVEST_SHEEP: 'JBXXIpi3Hw58NY031B6g-na3Ye1RyM8Q_uXuPSaOgcc',
        UPGRADE: 'KPLEJsb1RSBSM3g9zd4qlAH00fZG3wIFIA86EpJOQbM	',
        LOTTERY_WIN_REWARD_PHYSICAL: 'KEBfS7QL9Lk-3s_8qG1PhrxcpcU7-85qERTUxLGSjoQ',
        LOTTERY_WIN_REWARD_INTEGRAL: 'JBXXIpi3Hw58NY031B6g-na3Ye1RyM8Q_uXuPSaOgcc'
    },
    logdir: `${__dirname}/logs/`,
};

const preConfig = {
    db: 'mongodb://Ranch:yunfarm_000@101.201.197.163/Ranch1',
    redis: {
        port: 6379,
        host: '101.201.197.163',
        auth_pass: 'eGd3cEn38tYCQiDBzx7PTWwO'
    },
};
console.log('config env::', env);

let finalConfig = productionConfig;

if (env === 'test') {
    finalConfig = { ...productionConfig, ...testConfig };
} else if (env === 'development') {
    finalConfig = { ...productionConfig, ...devConfig };
} else if (env === 'functional') {
    finalConfig = { ...productionConfig, ...functionalConfig };
}

export default finalConfig;
