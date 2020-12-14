const config = require('../../config')
const schedule = require('node-schedule')
const { getInfo } = require('./info')
const { addHistory } = require('./db')
const util = require('../services/util')

async function saveInfo(client) {
    const channel = await client.channels.fetch(config.channelId)
    schedule.scheduleJob('*/10 * * * * *', async () => {
        const info = await getInfo()
        info.date = info.date.toLocaleString()
        info.diff = 0
        addHistory(info)

        const msg = `**${info.date}**
총 자산: ${util.money(info.won)} (자산의 ${info.coinPerWon})
코인 매수가: ${util.money(info.coin)}`
        channel.send(msg)
    })
}

module.exports = {
    saveInfo,
}
