const config = require('../../config')
const schedule = require('node-schedule')
const { getInfo } = require('./info')
const { nextFundingFee } = require('./funding')
const { addHistory } = require('./db')
const { money, repeat } = require('./util')
const { kimchi, kimchiTxt } = require('../services/kimchi')
const { fundingPer } = require('../services/util')

async function saveInfo(client) {
    const channel = await client.channels.fetch(config.channelId)
    schedule.scheduleJob('0 0 0 * * *', async () => {
        const info = await getInfo()
        info.date = info.date.toLocaleString()
        info.diff = 0
        addHistory(info)

        const msg = `**${info.date}**
총 자산: ${money(info.won)}
코인 매수가: ${money(info.coin)} (자산의 ${info.coinPerWon})`
        channel.send(msg)
    })
}

async function fundingFee(client) {
    const channel = await client.channels.fetch(config.channelId)
    schedule.scheduleJob('0 1 0,8,16 * * *', async () => {
        const { btc, eth, eos, btcNext, ethNext, eosNext } = await nextFundingFee()
        let txt = '```diff\n'
        txt += btc < 0 || eth < 0 ? '-' : '+'
        txt += ` 바이빗 펀딩피 (현재 -> 예상)
BTC: ${fundingPer(btc)} -> ${fundingPer(btcNext)}
ETH: ${fundingPer(eth)} -> ${fundingPer(ethNext)}
EOS: ${fundingPer(eos)} -> ${fundingPer(eosNext)}
`
        txt += '```'
        channel.send(txt)
    })
}

async function kimchiAlert(client) {
    const condition = 0.01
    const channel = await client.channels.fetch(config.channelId)

    function text(kimchi, diff) {
        const dp = Math.abs(diff * 100).toFixed(1)
        let txt = '```diff\n'
        txt += diff > 0
            ? `- 김프 ${dp}% 하락 (Upbit / Binance) ${repeat.spinner.now}\n`
            : `+ 김프 ${dp}% 상승 (Upbit / Binance) ${repeat.spinner.now}\n`
        txt += kimchiTxt(kimchi)
        txt += '```'
        return txt
    }

    let before = await kimchi()

    schedule.scheduleJob('0 */5 * * * *', async () => {
        const after = await kimchi()
        const diff = before.btcPre - after.btcPre

        if (diff > condition || diff < -condition) {
            const message = await channel.send(text(after, diff))

            repeat(async () => {
                    const after = await kimchi()
                    const diff = before.btcPre - after.btcPre
                    return message.edit(text(after, diff))
                },
                30,
                async () => {
                    before = await kimchi()
                },
            )
        }
    })
}

module.exports = {
    saveInfo,
    fundingFee,
    kimchiAlert,
}
