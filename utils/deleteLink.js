const fs = require('fs')
const filePath = process.env.LINKS_FILE

module.exports = link => {
	fs.readFile(filePath, {encoding: "utf-8"}, (err, data) => {
		const result = data.replace(link, '')

		fs.writeFile(filePath, result, (err) => {
			if(err){
				return console.error(err)
			}

			console.info('Link was removed!')
		})
	})
}


