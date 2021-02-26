const { kimchi } = require('../services/kimchi')

module.exports = async function (msg) {
    const { btcPre, ethPre, eosPre } = await kimchi()

    const txt = `업비트 <->바이낸스
BTC: ${(btcPre * 100).toFixed(2)}%
ETH: ${(ethPre * 100).toFixed(2)}%
EOS: ${(eosPre * 100).toFixed(2)}%
`
    msg.channel.send(txt)
}
