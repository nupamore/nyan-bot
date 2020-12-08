const upbit = require('../api/upbit')
const { MessageEmbed } = require('discord.js')
const util = require('../services/util')

const SKIP_MONEY = 10000

module.exports = async function (msg) {
    const data = await upbit.api('/accounts')
    const coins = data.map(coin => {
        coin.won = coin.balance * coin.avg_buy_price
        return coin
    })
    const bigCoins = coins.filter(coin => coin.won > SKIP_MONEY)
    const won = coins.find(coin => coin.currency === 'KRW').balance * 1
    const sum = won + bigCoins.reduce((p, n) => p + n.won, 0)

    const embed = new MessageEmbed()
    embed.setDescription(
        `단위: KRW, 매수 ${util.money(SKIP_MONEY)}원 미만 생략`,
    )
    embed.addField('총 자산', util.money(sum))
    bigCoins.forEach(coin => {
        embed.addField(
            coin.currency,
            `${util.money(coin.won)} (${util.percent(coin.won, sum)}%)`,
        )
    })
    msg.channel.send(embed)
}
