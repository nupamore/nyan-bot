const config = require('../../config')
const axios = require('axios')
const upbit = require('../api/upbit')
const util = require('../services/util')

async function getInfo() {
    const promises = await Promise.all([
        axios('https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD'),
        upbit.api('/ticker?markets=KRW-BTC'),
        upbit.api('/ticker?markets=KRW-ETH'),
        upbit.api('/ticker?markets=KRW-EOS'),
        axios(config.api.bybitUrl + '/public/tickers?symbol=BTCUSDT'),
        axios(config.api.bybitUrl + '/public/tickers?symbol=ETHUSDT'),
        axios(config.api.bybitUrl + '/public/tickers?symbol=EOSUSDT'),
    ])

    const dollar = promises[0].data.basePrice
    const upbitBTC = promises[1].trade_price
    const upbitETH = promises[2].trade_price
    const upbitEOS = promises[3].trade_price
    console.log(promises[4].data.result)
}

getInfo()
