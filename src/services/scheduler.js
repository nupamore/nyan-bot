const config = require('../../config')
const schedule = require('node-schedule')
const { getInfo } = require('./info')
const { nextFundingFee } = require('./funding')
const { addHistory } = require('./db')
const util = require('./util')

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
        const { btc, eth } = await nextFundingFee()
        const msg = `**바이빗 펀딩피**
BTC: ${btc}
ETH: ${eth}`
        channel.send(msg)
    })
}

module.exports = {
    saveInfo,
    fundingFee,
}
