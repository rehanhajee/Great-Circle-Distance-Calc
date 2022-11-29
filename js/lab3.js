posOptions = {enableHighAccuracy: false, timeout: 5000, maximumAge: 0};
var dropBox;
fileCoordinates = [0, 0];
currentLocationCoordinates = fileCoordinates;
address = "";
result = document.getElementById("myGeolocation");

window.onload = function() {
	
	dropBox = document.getElementById("dropBox");
	dropBox.ondragenter = ignoreDrag;
	dropBox.ondragover = ignoreDrag;
	dropBox.ondrop = drop;
	

	currentLocation();
};


function currentLocation() {
	let xhr = new XMLHttpRequest();

	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var response = JSON.parse(this.responseText);
			if(response.status !== 'success') {
				console.log('query failed: ' + response.message);
			} else {
				result.innerHTML = "Your current location is shown below: ";
				document.getElementById("mapLocation").innerHTML = "<iframe src=\"https://www.openstreetmap.org/export/embed.html?bbox=" + (response.lon + .0904) + "%2C" + (response.lat + .1449768) + "%2C" + (response.lon + .092465) + "%2C" + (response.lat + .1469768) + "&amp;layer=mapnik\"></iframe>";
				currentLocationCoordinates = [response.lat, response.lon];
			}
		}
	}
	xhr.open("GET", "http://ip-api.com/json/?fields=49344", true);
	xhr.send();
}

function customLocation() {
	if (document.getElementById("customLocation").value == "") {
		alert("Error. Please enter custom coordinates to use this function");
	} else {
		let input = document.getElementById("customLocation").value.split(", ");
		
		result.innerHTML = "Your custom location is shown below: ";
		document.getElementById("mapLocation").innerHTML = "<iframe src=\"https://www.openstreetmap.org/export/embed.html?bbox=" + (parseFloat(input[1]) - 0.001) + "%2C" + (parseFloat(input[0]) - 0.001) + "%2C" + (parseFloat(input[1]) + 0.001) + "%2C" + (parseFloat(input[0]) + 0.001) + "&amp;layer=mapnik\"></iframe>";

		currentLocationCoordinates = [input[0], input[1]];
	}
}

function ignoreDrag(e) {
	e.stopPropagation();
	e.preventDefault();
}

function drop(e) {
	e.stopPropagation();
	e.preventDefault();

	var data = e.dataTransfer;
	var files = data.files;
	processFiles(files);
}

function processFiles(files) {
	var file = files[0];
	var reader = new FileReader();
	
	reader.onload = function(e) {
		let result = reader.result.split(", ");
		fileCoordinates = [parseFloat(result[0]), parseFloat(result[1])];
		getFileLocation(currentLocationCoordinates);
		webWorker([currentLocationCoordinates, fileCoordinates]);
	}
	reader.readAsText(file);
}

function getFileLocation(position) {
	
	let xmlhttp = new XMLHttpRequest();
	let jsonResponse;
	
	xmlhttp.onreadystatechange = function() {
		if(xmlhttp.readyState == 4 && xmlhttp.status == 200) {
			jsonResponse = xmlhttp.responseText;
			locationFunction(jsonResponse);
		}
	}
	xmlhttp.open("GET", "https://nominatim.openstreetmap.org/reverse?format=json&lat=" + fileCoordinates[0] + "&lon=" + fileCoordinates[1], true);
	xmlhttp.send();

	function locationFunction(response) {
		let fileLocation = JSON.parse(response);
		let output = document.getElementById("fileLocation");
		output.innerHTML = "The address of the coordinates from your file is: "; 
		let displayName = fileLocation.display_name.split(", ");
		if (fileLocation.address.hasOwnProperty("house_number")) output.innerHTML += fileLocation.address.house_number + fileLocation.address.road;
		else output.innerHTML += displayName[0] + ", " + displayName[1];
		
		output.innerHTML += ", " + displayName[5] + ", " + displayName[8];
	}
}

function webWorker(position) {
	var myWorker = new Worker("js/wworker.js");

	myWorker.onerror = function(event) {
		console.log('Error in web worker: ' + event.message + '\n');
	};

	myWorker.onmessage = function(event) {
		document.getElementById("distance").innerHTML = "Distance to your point: " + event.data + " kilometres";
	}

	myWorker.postMessage(position);
}




