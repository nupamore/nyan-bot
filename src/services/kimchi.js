const config = require('../../config')
const axios = require('axios')
const upbit = require('../api/upbit')

async function kimchi() {
    const promises = await Promise.all([
        axios(
            'https://quotation-api-cdn.dunamu.com/v1/forex/recent?codes=FRX.KRWUSD',
        ),
        upbit.api('/ticker?markets=KRW-BTC'),
        upbit.api('/ticker?markets=KRW-ETH'),
        upbit.api('/ticker?markets=KRW-EOS'),
        axios(config.api.binanceUrl + '/trades?symbol=BTCUSDT&limit=1'),
        axios(config.api.binanceUrl + '/trades?symbol=ETHUSDT&limit=1'),
        axios(config.api.binanceUrl + '/trades?symbol=EOSUSDT&limit=1'),
    ])
    const data = {
        dollar: promises[0].data[0].basePrice,
        upbitBTC: promises[1][0].trade_price,
        upbitETH: promises[2][0].trade_price,
        upbitEOS: promises[3][0].trade_price,
        binanceBTC: promises[4].data[0].price * 1,
        binanceETH: promises[5].data[0].price * 1,
        binanceEOS: promises[6].data[0].price * 1,
        btcPre: 0,
        ethPre: 0,
        eosPre: 0,
    }

    data.btcPre = data.upbitBTC / (data.binanceBTC * data.dollar) - 1
    data.ethPre = data.upbitETH / (data.binanceETH * data.dollar) - 1
    data.eosPre = data.upbitEOS / (data.binanceEOS * data.dollar) - 1

    return data
}

function kimchiTxt({ btcPre, ethPre, eosPre }) {
    let txt = 'BTC, ETH, EOS: '
    txt += `${(btcPre * 100).toFixed(2)}%`
    txt += `, ${(ethPre * 100).toFixed(2)}%`
    txt += `, ${(eosPre * 100).toFixed(2)}%`
    return txt
}

module.exports = {
    kimchi,
    kimchiTxt,
}
