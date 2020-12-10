const config = require('../../config')
const axios = require('axios')
const upbit = require('../api/upbit')
const { MessageEmbed } = require('discord.js')
const util = require('../services/util')

const SKIP_MONEY = 100

module.exports = async function (msg) {
    const data = await upbit.api('/accounts')
    const coins = data.map(coin => {
        coin.won = coin.balance * coin.avg_buy_price
        return coin
    })
    const bigCoins = coins.filter(coin => coin.won > SKIP_MONEY)
    const won = coins.find(coin => coin.currency === 'KRW').balance * 1
    const coinsBuySum = bigCoins.reduce((p, n) => p + n.won, 0)
    const sum = won + coinsBuySum

    let coinsNow,
        coinsNowText = ''
    const tickers = bigCoins
        .filter(coin => coin.currency !== 'KRW')
        .filter(coin => coin.unit_currency === 'KRW')
        .map(coin => `KRW-${coin.currency}`)
    if (tickers.length) {
        coinsNow = await axios({
            baseURL: config.api.upbitUrl,
            url: '/ticker',
            params: { markets: tickers.toString() },
        })
        coinsNow.data.forEach(coin => {
            const before = bigCoins.find(bc =>
                coin.market.includes(bc.currency),
            )
            const buy = before.balance * before.avg_buy_price
            const now = before.balance * coin.trade_price
            const percent = util.percentDiff(now - buy, buy)
            coinsNowText += `**${before.currency}** 평단: ${util.money(
                buy,
            )}, 현재: ${util.money(now)} (${percent})\n`
        })
    }

    const embed = new MessageEmbed()
    embed.addField('총 자산', `${util.money(sum)}`)
    embed.setDescription(`코인 매수 ${util.money(SKIP_MONEY)} 이하 제외`)
    embed.addField(
        '코인 매수가',
        `${util.money(coinsBuySum)} (자산의 ${util.percent(coinsBuySum, sum)})`,
    )
    embed.addField('코인 현재가', coinsNowText)

    msg.channel.send(embed)
}
