var express = require('express')
var app = express()
var promise = require('bluebird')
const cors = require('cors')

const initOptions = {
	promiseLib: promise
};

const pg = require('pg-promise')(initOptions);

const cn = {
	'host': '',
	'port': '',
	'database': '',
	'user': '',
	'password': ''
};

const db = pg(cn);

var bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var HTTP_PORT = 8000

app.listen(HTTP_PORT, () => {
	console.log("Server running on %PORT%".replace("%PORT%", HTTP_PORT));
});

app.get('/api/getFloorData/:id', (req, res, next) => {
	db.connect()
	.then(function (obj) {
		obj.done();
	})
	.catch(function (error) {
		console.log("error:", error.message);
		res.json( { success: false } );
	});

	floor = req.params.id;

	if (['3','4'].includes(floor)) {
		db.any(`SELECT place_id, amount FROM camera_actual_data WHERE CAST(place_id AS VARCHAR(3)) LIKE '${floor}%'`)
			.then(data => {
				for ( const place of data ) {
					place.amount = Math.floor(Math.random() * 15 + 1);
					place.percentage = Math.min(place.amount, 10) * 10;
				}
				res.json( { success: true, data: data } );
			})
			.catch(error => {
				console.log('Error:', error);
				res.json( { success: false } );
		});
	}

});
