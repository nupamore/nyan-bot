const config = require('../../config')
const axios = require('axios').create()
const { v4: uuidv4 } = require('uuid')
const sign = require('jsonwebtoken').sign
const queryEncode = require('querystring').encode
const crypto = require('crypto')

/**
 * upbit api
 * @param {String} url
 * @param {Object} params
 */
async function api(url, params) {
    const payload = {
        access_key: config.api.upbitAccess,
        nonce: uuidv4(),
    }
    if (params) {
        const query = queryEncode(params)
        const hash = crypto.createHash('sha512')
        payload['query_hash'] = hash.update(query, 'utf-8').digest('hex')
        payload['query_hash_alg'] = 'SHA512'
    }
    const token = sign(payload, config.api.upbitSecret)

    // request
    const res = await axios({
        baseURL: config.api.upbitUrl,
        url,
        headers: { Authorization: `Bearer ${token}` },
    })
    return res.data
}

module.exports = {
    api,
}
