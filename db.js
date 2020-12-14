const sqlite3 = require('sqlite3').verbose()
const db = new sqlite3.Database('.db')

db.serialize(function () {
    db.run(`CREATE TABLE history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        date TEXT,
        won INT,
        coin INT,
        diff REAL
    )`)
})

db.close()
