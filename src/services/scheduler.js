const config = require('../../config')
const schedule = require('node-schedule')
const { getInfo } = require('./info')
const { nextFundingFee } = require('./funding')
const { addHistory } = require('./db')
const util = require('./util')
const { kimchi } = require('../services/kimchi')

async function saveInfo(client) {
    const channel = await client.channels.fetch(config.channelId)
    schedule.scheduleJob('0 0 0 * * *', async () => {
        const info = await getInfo()
        info.date = info.date.toLocaleString()
        info.diff = 0
        addHistory(info)

        const msg = `**${info.date}**
총 자산: ${util.money(info.won)}
코인 매수가: ${util.money(info.coin)} (자산의 ${info.coinPerWon})`
        channel.send(msg)
    })
}

async function fundingFee(client) {
    const channel = await client.channels.fetch(config.channelId)
    schedule.scheduleJob('0 1 0,8,16 * * *', async () => {
        const { btc, eth, btcNext, ethNext } = await nextFundingFee()
        const msg = `**현재**
BTC: ${btc}
ETH: ${eth}
**예상**
BTC: ${btcNext}
ETH: ${ethNext}`
        channel.send(msg)
    })
}

function kimchiTxt({ btcPre, ethPre, eosPre }) {
    return `업비트 <->바이낸스
BTC: ${(btcPre * 100).toFixed(2)}%
ETH: ${(ethPre * 100).toFixed(2)}%
EOS: ${(eosPre * 100).toFixed(2)}%
    `
}

async function kimchiAlert(client) {
    const channel = await client.channels.fetch(config.channelId)
    let before = await kimchi()

    schedule.scheduleJob('* */5 * * * *', async () => {
        const after = await kimchi()

        if (before.btcPre - after.btcPre > 0.01) {
            channel.send('김프 1% 하락 알림')
            channel.send(kimchiTxt(after))
            before = after
        } else if (before.btcPre - after.btcPre < -0.01) {
            channel.send('김프 1% 상승 알림')
            channel.send(kimchiTxt(after))
            before = after
        }
    })
}

module.exports = {
    saveInfo,
    fundingFee,
    kimchiAlert,
}
