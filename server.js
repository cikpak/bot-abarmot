const express = require('express');
const app = express();

require('dotenv').config();

app.use(express.urlencoded())

const PORT = process.env.PORT||3000

app.use('/bot', require('./routes/handleJson'))

//errors handler
// app.use(require('./middleware/errors.middleware'));

app.listen(PORT, () => {
	console.log(`server listen on ${PORT}`);
});
