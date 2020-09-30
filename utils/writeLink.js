const fs = require('fs')
const filePath = process.env.LINKS_FILE

module.exports = async (link) => {
    try {
        fs.readFile(filePath, {encoding: "utf-8"}, (err, data) => {
            const existingLinks = data.split('\n')
            if (!existingLinks.includes(link)) {
                const toWrite = data + `${link}\n`

                fs.writeFile(filePath, toWrite, {}, (err) => {
                    if (err) {
                        console.error(err)
                    } else {
                        console.log('New link was writed to file!')
                    }
                })
            }
        })
    } catch (e) {

    }
}