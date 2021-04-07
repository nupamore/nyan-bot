const config = require('../../config')
const schedule = require('node-schedule')
const { getInfo } = require('./info')
const { nextFundingFee } = require('./funding')
const { addHistory } = require('./db')
const util = require('./util')
const { kimchi } = require('../services/kimchi')
const { fundingPer } = require('../services/util')

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
        const { btc, eth, eos, btcNext, ethNext, eosNext } = await nextFundingFee()
        let txt = '```diff\n'
        txt += btc < 0 || eth < 0 ? '-' : '+'
        txt += `바이빗 펀딩피 (현재 -> 예상)
BTC: ${fundingPer(btc)} -> ${fundingPer(btcNext)}
ETH: ${fundingPer(eth)} -> ${fundingPer(ethNext)}
EOS: ${fundingPer(eos)} -> ${fundingPer(eosNext)}
`
        txt += '```'
        channel.send(txt)
    })
}

function kimchiTxt({ btcPre, ethPre, eosPre }) {
    let txt = '\nBTC, ETH, EOS: '
    txt += `${(btcPre * 100).toFixed(2)}%`
    txt += `, ${(ethPre * 100).toFixed(2)}%`
    txt += `, ${(eosPre * 100).toFixed(2)}%`
    return txt
}

async function kimchiAlert(client) {
    const channel = await client.channels.fetch(config.channelId)
    let before = await kimchi()

    schedule.scheduleJob('0 */2 * * * *', async () => {
        const after = await kimchi()
        let txt = '```diff\n'

        if (before.btcPre - after.btcPre > 0.01) {
            txt += '- 김프 1% 하락 (Upbit / Binance)'
            channel.send(txt + kimchiTxt(after) + '```')
            before = after
        } else if (before.btcPre - after.btcPre < -0.01) {
            txt += '+ 김프 1% 상승 (Upbit / Binance)'
            channel.send(txt + kimchiTxt(after) + '```')
            before = after
        }
    })
}

module.exports = {
    saveInfo,
    fundingFee,
    kimchiAlert,
}
