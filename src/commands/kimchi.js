const { kimchi } = require('../services/kimchi')

async function kimchiText() {
    const { btcPre, ethPre, eosPre } = await kimchi()
    const now = new Date()
    let txt = '```\n'
    txt += `김프 1분간 실시간 (Upbit / Binance)\n`
    txt += 'BTC, ETH, EOS: '
    txt += `${(btcPre * 100).toFixed(2)}%`
    txt += `, ${(ethPre * 100).toFixed(2)}%`
    txt += `, ${(eosPre * 100).toFixed(2)}%`
    txt += '\n```'
    return txt
}

function repeat(fn, count) {
    if (!count) return false
    setTimeout(() => {
        fn()
        repeat(fn, --count)
    }, 2000)
}

module.exports = async function (msg) {
    const text = await kimchiText()
    const message = await msg.channel.send(text)

    repeat(async () => {
        message.edit(await kimchiText())
    }, 30)
}
