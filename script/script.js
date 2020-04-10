function perc2color(perc, min = 100, max = 0) {
	var base = (max - min);
	
  if (base == 0) { 
  	perc = 100; 
  } else {
  	perc = (perc - min) / base * 100; 
	}
	
  var r, g, b = 0;
	if (perc < 50) {
		r = 255;
		g = Math.round(5.1 * perc);
	} else {
  	r = Math.round(510 - 5.10 * perc);
		g = 255;
	}
	var h = r * 0x10000 + g * 0x100 + b * 0x1;
	return '#' + ('000000' + h.toString(16)).slice(-6);
}

function setDesc(elem) {
	let desc = $(elem).attr('data')
	$('#text').text(desc + ' человек находятся в зоне на 10 мест')
}

function changeColor() {
	let floor = $('#floorImg').attr('floor-data')
	$.ajax({
		url: document.location.origin + ':8000/api/getFloorData/' + floor,
		type: 'get',
		success: function(response) {
			if (!response.success) return

			let places = response.data;

			places.forEach(place => {
				$('#' + place.place_id).attr('fill', perc2color(place.percentage))
				$('#' + place.place_id).attr('data', place.count)
			})
		}
	});
}

$(document).ready(function() {
	changeColor();
	setInterval(changeColor, 10000);
})