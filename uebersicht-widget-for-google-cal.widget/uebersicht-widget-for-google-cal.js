// you can add a couple of calendar feeds within this array
feedUrls: [
	'PUT YOUR GOOGLE XML FEED URL HERE'
],

// 1 = only today, 2 = today + tomorrow
nextDays: 1,

// 10min = 60s * 10 = 600
refreshFrequency: 1000 * 600,

style: '#upcomingGoogleEvents { border-radius: 5px; background-color: rgba(#fff, 0.5); margin: 20px; padding: 0 10px 5px; } #upcomingGoogleEvents .lastUpdate { margin-top: 20px; font-size: 85%; color: #999; } #upcomingGoogleEventsContent h2 { margin-top: 25px; }',


/***********************************
 * Don't change anything below
 ***********************************/


command: '',

render: function() {
	return '<div id="upcomingGoogleEvents"><h1>Upcoming Events</h1><div id="upcomingGoogleEventsContent"></div></div>';
},

update: function(output, domEl) {
	var self = this,
		content = '',
		currentTime = new Date,
		todayAsString = currentTime.toISOString().replace(/T.*/, ''),
		tomorrowTime = new Date(new Date().getTime() + this.nextDays * 24 * 60 * 60 * 1000),
		tomorrowAsString = tomorrowTime.toISOString().replace(/T.*/, '');

	$.each(this.feedUrls, function(index, feedUrl) {
		$.ajax({
			url: feedUrl,
			dataType: 'json',
			async: false,
			data: {
				'orderby': 'starttime',
				'start-min': todayAsString,
				'start-max': tomorrowAsString,
				'singleevents': 'true',
				'alt': 'json'
			},
			success: function(data) {
				content += self.renderCalData(data);
			}
		});
	});

	content += '<p class="lastUpdate">Last update: ' + currentTime.toLocaleTimeString() + '</p>';

	$('#upcomingGoogleEventsContent').html(content);
},

renderCalData: function(data) {
	var content = '';

	if (data['feed'] && data.feed['entry']) {
		content = '<h2>' + data.feed.title.$t + '</h2>';

		$.each(data.feed.entry, function(index, entry) {
			content += '<h3>' + entry.title.$t + '</h3>';
			content += '<p>' + entry.summary.$t.substr(0, entry.summary.$t.indexOf('<br>')) + '</p>';
			console.log(entry.summary.$t);
		});
	}

	return content;
}