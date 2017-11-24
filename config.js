/**
 * Created by bj on 16/7/28.
 */
const env = process.env.NODE_ENV;

const productionConfig = {
    session_secret: 'cH38wtQAj9X672QgNUR0L7x5n1MNIh556677',
    cookie_max_age: 10 * 24 * 3600 * 1000,
    session_max_age: 10 * 24 * 3600,

    db: 'mongodb://user:pass@master.mongodb.yunfarm.net/database',

    redis: {
        port: 6379,
        host: 'dada',
        auth_pass: 'biabia'
    },
    wechat_store: {
        appid: 'biubiu',
        appsecret: 'fuckyou',
        ACCESSTOKEN_KEY: 'store_weixin_xxxx',
        JSAPITICKET_KEY: 'store_weixin_ccccc',
        token: 'store'
    },
    AliPushCfg: {
        url: 'iiii',
        appKey: '23372525tt'
    },
    wxTemplate: {
        INVITE_FRIENDS_INVEST: 'OPENTM204658409',
        INVEST_SHEEP: 'OPENTM204658409',
        UPGRADE: 'OPENTM401426285',
        LOTTERY_WIN_REWARD_PHYSICAL: 'OPENTM401684051',
        LOTTERY_WIN_REWARD_INTEGRAL: 'OPENTM204658409'
    },
    logServer: {
        host: 'yyyyyyyyyy',
        port: 33333
    },
    logdir: './data/logs/' // 日志文件夹
};

// 测试环境
const functionalConfig = {
    db: 'mongodb://user:pass@master.mongodb.yunfarm.net/database',
    redis: {
        port: 6379,
        host: '101.201.197.445',
        auth_pass: 'xxooxoxox'
    },
    AliPushCfg: {
        url: 'bibibbibbio',
        appKey: '23372525'
    }
};

//  开发环境
const devConfig = {
    db: 'mongodb://127.0.0.1/koa-test',
    redis: {
        port: 6379,
        host: '127.0.0.1'
    },
    logServer: {
        host: '127.0.0.1',
        port: 33333
    },
    logdir: `${__dirname}/logs/`
};

// 单元测试
const testConfig = {
    db: 'mongodb://127.0.0.1/koa-test',
    redis: {
        port: 6379,
        host: '127.0.0.1',
        auth_pass: 'eGd3cEn38tYCQiDBzx7PTWwO'
    },
    logServer: {
        host: '',
        port: 33333
    },
    logdir: `${__dirname}/logs/`,
};

const preConfig = {
    db: 'mongodb://127.0.0.1/koa-test',
    redis: {
        port: 6379,
        host: '127.0.0.1'
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
