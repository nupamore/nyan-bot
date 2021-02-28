const { kimchi } = require('../services/kimchi')

module.exports = async function (msg) {
    const { btcPre, ethPre, eosPre } = await kimchi()
    let txt = '```'
    txt += `김치프리미엄 (Upbit / Binance)
BTC: ${(btcPre * 100).toFixed(2)}%
ETH: ${(ethPre * 100).toFixed(2)}%
EOS: ${(eosPre * 100).toFixed(2)}%
`
    txt += '```'
    msg.channel.send(txt)
}
