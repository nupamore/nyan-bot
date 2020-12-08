const config = require('../../config')
const schedule = require('node-schedule')

async function saveInfo(client) {
    const channel = await client.channels.fetch(config.channelId)
    schedule.scheduleJob('0 0 0 * * *', function () {
        channel.send('서버시간 0시 정각')
    })
}

module.exports = {
    saveInfo,
}
