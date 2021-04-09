const { kimchi, kimchiTxt } = require('../services/kimchi')
const { repeat } = require('../services/util')

async function text() {
    let txt = '```\n'
    txt += `김치 프리미엄 (Upbit / Binance)\n`
    txt += kimchiTxt(await kimchi())
    txt += '```'
    return txt
}

module.exports = async function (msg) {
    const message = await msg.channel.send(await text())
    repeat(async () => {
        message.edit(await text())
    }, 30)
}
