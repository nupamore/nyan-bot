const { kimchi } = require('../services/kimchi')

module.exports = async function (msg) {
    const { btcPre, ethPre, eosPre } = await kimchi()
    let txt = '```\n'
    txt += `김치프리미엄 (Upbit / Binance)\n`
    txt += 'BTC, ETH, EOS: '
    txt += `${(btcPre * 100).toFixed(2)}%`
    txt += `, ${(ethPre * 100).toFixed(2)}%`
    txt += `, ${(eosPre * 100).toFixed(2)}%`
    txt += '\n```'
    msg.channel.send(txt)
}
