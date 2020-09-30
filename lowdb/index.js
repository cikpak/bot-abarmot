const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')

const adapter = new FileSync('db.json')
const db = low(adapter)

// if (!db.getState().users) {
//     db.defaults({
//         users: [],
//         links: []
//     }).write()

    //1 user
    // {
    //     userId: '', //user id
    //     chatId: ',', //chat id
    //     links: [], // links
    // }
// }

module.exports = db