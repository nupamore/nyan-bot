const upbit = require('../api/upbit')
const util = require('../services/util')

;(async () => {
    const data = await upbit.api('/accounts')
    const coins = data.map(coin => {
        coin.won = coin.balance * coin.avg_buy_price
        return coin
    })
    const bigCoins = coins.filter(coin => coin.won > 100)
    const won = coins.find(coin => coin.currency === 'KRW').balance * 1
    const sum = won + bigCoins.reduce((p, n) => p + n.won, 0)

    console.log(util.money(sum))
    console.log(sum)
})()
