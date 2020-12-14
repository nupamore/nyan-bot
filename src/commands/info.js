const config = require('../../config')
const { MessageEmbed } = require('discord.js')
const util = require('../services/util')
const { getInfo } = require('../services/info')

module.exports = async function (msg) {
    const info = await getInfo()

    const embed = new MessageEmbed()
    embed.addField('총 자산', `${util.money(info.won)}`)
    embed.setDescription(`코인 매수 ${util.money(config.SKIP_MONEY)} 이하 제외`)
    embed.addField(
        '코인 매수가',
        `${util.money(info.coin)} (자산의 ${info.coinPerWon})`,
    )
    embed.addField('코인 현재가', info.coinsNowText || '없음')

    msg.channel.send(embed)
}
