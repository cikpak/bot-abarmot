const db = require('../lowdb/index')

module.exports =  (link) => {
    const users = db.getState().users

    let linkFollowers = []
    users.map(user => {
        if (user.links.includes(link)) {
            linkFollowers.push(user.userId)
        }
    })

    return linkFollowers
}