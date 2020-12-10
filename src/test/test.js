const info = require('../commands/info')

;(async () => {
    await info({
        channel: {
            send(str) {
                console.log(str)
            },
        },
    })
})()
