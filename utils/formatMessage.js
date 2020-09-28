module.exports = (info) => {
	return `
		<b>Order info</b>\n
		<b>Posted:</b> ${info.postedDate}\n
		<b>Ship:</b> ${info.shipingDate}\n
		<a href="https://www.google.ru/search?q=${info.vehicle}&newwindow=1&source=lnms&tbm=isch">Фото авто</a>
		\n
		<b>Telephone:</b> ${info.phone}
		\n
		<a href="${info.route}">🏁 Посмотреть маршрут</a>
	`
}