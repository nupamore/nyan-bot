function money(amount, decimalCount = 0, decimal = '.', thousands = ',') {
    try {
        decimalCount = Math.abs(decimalCount)
        decimalCount = isNaN(decimalCount) ? 0 : decimalCount

        const negativeSign = amount < 0 ? '-' : ''

        let i = parseInt(
            (amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)),
        ).toString()
        let j = i.length > 3 ? i.length % 3 : 0

        return (
            negativeSign +
            (j ? i.substr(0, j) + thousands : '') +
            i.substr(j).replace(/(\d{3})(?=\d)/g, '$1' + thousands) +
            (decimalCount
                ? decimal +
                  Math.abs(amount - i)
                      .toFixed(decimalCount)
                      .slice(2)
                : '') +
            '원'
        )
    } catch (e) {
        console.log(e)
    }
}

function percent(child, parent) {
    const percent = ((child / parent) * 100).toFixed(2)
    if (isNaN(percent)) return '0%'
    else return `${percent}%`
}

function percentDiff(child, parent) {
    const percent = ((child / parent) * 100).toFixed(2)
    if (percent > 0) return `+${percent}%`
    else if (percent < 0) return `${percent}%`
    else return '0%'
}

function fundingPer(num) {
    return num.toFixed(4) + '%'
}

const spinner = {
    arr: ['⠋', '⠙', '⠴', '⠦'],
    frame: -1,
    get now() {
        return this.frame < 0 ? '' : this.arr[this.frame % 4]
    }
}

function repeat(fn, count, lastCallback) {
    if (!count) {
        if (lastCallback) lastCallback()
        return false
    }
    if (count == 1) spinner.frame = -1
    else spinner.frame++
    setTimeout(async () => {
        await fn()
        repeat(fn, --count, lastCallback)
    }, 1000)
}
repeat.spinner = spinner

module.exports = {
    money,
    percent,
    percentDiff,
    fundingPer,
    repeat,
}
