const dict = {
	"Отправление": "start",
	"Отправление доп. описание": "startInfo",
	"Отправление URL": "startUrl",
	"Прибытие": "destination",
	"Прибытие доп. описание": "destinationInfo",
	"Прибытие URL": "destinationUrl",
	"Транспорт": "transport",
	"Транспорт автомобили": 'vehicle',
	"Цена": "price",
	"Цена доп. описание": "priceInfo",
	"Контакт URL": "contactUrl",
	"Контакт": "contact",
	"Телефон": "phone",
	"Описание": "description",
	"Маршрут": "route",
	"Дата_posted": "postedDate",
	"Дата_ship": "shipingDate",
	"Фото": 'photos',
	"URL поиска": "searchUrl"
}


module.exports = (req, res, next) => {
	try {
		const info = JSON.parse(req.body.info)
		const caLaOameni = {}

		Object.keys(info).map(key => {
			caLaOameni[dict[key]] = info[key]
		})

		req.body.info = caLaOameni
		next()
	} catch(e) {
		next(e)
	}
}