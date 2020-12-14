const sqlite3 = require('sqlite3').verbose()

const db = new sqlite3.Database('.db')

function lastHistory(callback) {
    db.serialize(() => {
        db.each(
            'SELECT * FROM history ORDER BY id desc LIMIT 1',
            (err, row) => {
                callback(row)
            },
        )
    })
}

function addHistory(history) {
    const { date, won, coin, diff } = history
    db.serialize(() => {
        const stmt = db.prepare('INSERT INTO history VALUES (?, ?, ?, ?)')
        stmt.run([date, won, coin, diff])
        stmt.finalize()
    })
}

module.exports = {
    lastHistory,
    addHistory,
}
