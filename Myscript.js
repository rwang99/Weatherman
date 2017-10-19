walk(document.body);



function walk(node)  
{
	
	var child, next;

	switch ( node.nodeType )  
	{
		case 1: // Element
		case 9:  // Document
		case 11: // Document Fragment
			child = node.firstChild;
			while ( child ) 
			{
				next = child.nextSibling; 
				walk(child);
				child = next;
			}
			break;

		case 3:  			// Text Type
			handleText(node);
			break;
	}
}

function getWeather(time, callback){
	var city = '';
	var state = '';
	var weather;
	var loc = ""; 

	// $.ajax({
	// 	url: 'https://ipinfo.io',
	// 	dataType:'json',
	// 	async:false,
	// 	success: function(data){
	// 	city += data.city;
	// 	state += data.region;
	// 	}	
	// });

	// console.log(city);

	// var loc = city + ", " + state;
	
	// console.log(loc);
	if("geolocation" in navigator){
		navigator.geolocation.getCurrentPosition(function(position){
			//console.log(time);
			loadWeather(position.coords.latitude + "," + position.coords.longitude + "," + time/1000);
		});
	}

	var apiKey = "49e2f0e1e376f2bfd603ff5bf8ea1080";
	function loadWeather(info){
		//console.log("https://api.darksky.net/forecast/" + apiKey + "/" + info);
		$.ajax({
    		url:  "https://api.darksky.net/forecast/" + apiKey + "/" + info,
    		dataType: 'json',
    		success:function(data){
    			//console.log("loadweather"+data["daily"]["icon"]);
    			callback(data);
    		}
  		});
	}

}


function handleText(textNode) 
{
	var inputText = textNode.nodeValue;

	var thisYear = new Date().getYear();
	var thisTime = new Date().getTime();
	
	var date = inputText.match(/\b(?:(?:Mon)|(?:Tues?)|(?:Wed(?:nes)?)|(?:Thur?s?)|(?:Fri)|(?:Sat(?:ur)?)|(?:Sun))(?:day)?\b[:\-,]?\s*[a-zA-Z]{3,9}\s+\d{1,2}\s*,?\s*\d{4}/);
	
	if (date){
			var timeDiff = Math.abs(new Date(date).getTime() - thisTime);
			var dateDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
	
			if (dateDiff<=7){
				getWeather(new Date(date).getTime(), function(weather){
					var w = weather["daily"]["data"][0]["icon"];
					switch (w){			// Emoji adding if possible
						case "clear-day":
						case "clear-night":
							w = "☀ " + w;
							break;
						case "rain":
							w = "🌧 " + w;
							break;
						case "sleet":
							w = "❄ " + w;
							break;
						case "snow":
							w = "❄ " + w;
							break;
						case "cloudy":
							w = "☁ " + w;
							break;
						case "wind":
							w = "💨 " + w;
						case "partly-cloudy-day":
						case "partly-cloudy-night":
							w = "⛅ " + w;
							break;
						case "thunderstorm":
							w = "⛈ " + w;
							break;
						case "fog":
							w = "🌫 " + w;
							break;
					}
					console.log(w);
					var temp = weather["daily"]["data"][0]["temperatureHigh"];
					/*if (temp>100){
						temp += "🔥";
					}*/
					inputText = inputText.replace(date,date+" (weather: " + w + ", " + temp + " F)"); 
					textNode.nodeValue = inputText;
				})};
		// var timeDiff = Math.abs(new Date(date).getTime() - thisTime);
		// var dateDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
		//var w = weather.forecast[dateDiff].high;
		//inputText = inputText.replace(date,date+"w");
		//☀,️🌤,⛅,️🌥,🌦,☁️,🌧,⛈,🌩,⚡️,🔥,💥,❄️,🌨,☃,⛄️,🌬,💨,🌪,🌫,☂,☔️,💧,💦,🌊
	};


}