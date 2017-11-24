/**
 * Created by bj on 16/8/9.
 */

import crypto from 'crypto';
import requestFn from 'request';
import querystring from 'querystring';
import _ from 'lodash';

export const setLinkHeader = (request, response, pageInfo) => {
    let link = '';
    const searchParams = request.query;

    // prev
    if (pageInfo.hasPreviousPage) {
        searchParams.page = pageInfo.prePage;
        link += `<${getUrl(request)}?${querystring.stringify(searchParams)}>; rel="prev",`;
    }

    // next
    if (pageInfo.hasNextPage) {
        searchParams.page = pageInfo.nextPage;
        link += `<${getUrl(request)}?${querystring.stringify(searchParams)}>; rel="next",`;
    }

    // first
    searchParams.page = pageInfo.firstPage;
    link += `<${getUrl(request)}?${querystring.stringify(searchParams)}>; rel="first",`;

    // last
    searchParams.page = pageInfo.lastPage;
    link += `<${getUrl(request)}?${querystring.stringify(searchParams)}>; rel="last",`;

    // count
    link += `<${pageInfo.count}>; rel="count"`;

    response.setHeader('Link', link)
};

export const getUrl = (request) => {
    const protocol = request.protocol;
    const host = request.host;
    const path = request.path;
    return protocol + '://' + host + path
};

export const digest = (data, algorithm) => {
    algorithm || (algorithm = 'md5');
    const shasum = crypto.createHash(algorithm);
    shasum.update(data);
    const d = shasum.digest('hex');
    return d;
};

export const sha256 = (str, encoding) => {
    if (!encoding) encoding = 'utf-8';
    var md5sum = crypto.createHash('sha256');
    md5sum.update(str, encoding);
    str = md5sum.digest('hex');
    return str;
};

/**
 * 获取客户端IP
 * @param req
 * @returns {*|string|string|String}
 */
export const getClientIp = (req) => {
    return req.ips[0] || req.headers['x-real-ip'] || req.headers['X-Real-Ip'] || req.headers['X-Forwarded-For'] || req.headers['x-forwarded-for'] || req.ip;
};

/**
 * 获取请求信息
 * @param server
 * @param path
 * @returns {{url: string, headers: {content-type: string}}}
 */
export const initOptions = (server, path) => {
    return {
        url: `${server.protocol}://${server.hostname}:${server.port}/${path}`,
        json: true,
        headers: {
            'content-type': 'application/json; charset=UTF-8'
        }
    }
};

/**
 * Promise化request
 * @param opts
 * @returns {Promise}
 */
export const request = (opts) => {
    opts = opts || {};
    return new Promise((resolve, reject) => {
        requestFn(opts, (error, response, body) => {

            if (error) {
                return reject(error);
            }
            resolve(body);
        })

    })

};

/**
 * 发送get请求
 * Promise化request
 * @param opts   请求信息
 * @param params 请求参数
 * @returns {Promise}
 */
export const requestGet = (opts, params) => {
    opts = opts || {}
    opts = {
        ...opts,
        method: 'GET',
        url: `${opts.url}?${querystring.stringify(params)}`
    }
    return new Promise((resolve, reject) => {
        requestFn(opts, (error, response, body) => {
            if (error) {
                return reject(error)
            }
            const result = {
                data: body
            }
            const headLink = response.headers.link
            let linkMap = {}
            // 解析link，找到总条目数。放到result.count 里面
            if (headLink !== null && headLink !== undefined) {
                const str = headLink.split(',')
                for (const i in str) {
                    const s = str[i].split(';')
                    if (s.length === 2) {
                        const t = s[1].split('=')
                        linkMap[t[1].substring(1, t[1].length - 1)] = s[0].substring(1, s[0].length - 1)
                    }
                }
                result.count = linkMap.count || 0;
            }

            resolve(result);
        });
    });
};

export const asteriskString = (str, begin, length) => {
    if (str) {
        let count = length || str.length - begin;

        if (count < 0) {
            return str;
        }
        if (begin + count > str.length) {
            count = str.length - begin;
        }

        let tail = str.length - (begin + count);

        if (tail < 0) {
            tail = 0;
        }

        return `${_.take(str, begin).join('')}${_.repeat('*', count)}${_.takeRight(str, tail).join('')}`;
    }
    return null;
};

export default {};
