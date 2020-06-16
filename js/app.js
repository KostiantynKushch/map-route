'use strict';

// autocomplite for input fields
let inputStartPoint = document.querySelector('[data-start-point]');
let inputDestinationPoint = document.querySelector('[data-destination]');
const error = document.querySelector('.ba-route__error');
const options = {};

// The location of defaultPos
let defaultPos = { lat: 49.590007, lng: 34.550714 };


// Initialize and add the map
function initMap() {
	let directionsService = new google.maps.DirectionsService();
	let directionsRenderer = new google.maps.DirectionsRenderer();
	let infoWindow = new google.maps.InfoWindow;
	let marker;
	let bounds = new google.maps.LatLngBounds();


	// geolocation 
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(function (position) {
			const pos = {
				lat: position.coords.latitude,
				lng: position.coords.longitude
			};


			// The marker, positioned at defaultPos
			marker = new google.maps.Marker({
				position: pos,
				title: 'Current Location'
			});

			marker.setMap(map);
			bounds.extend(pos);
			map.fitBounds(bounds);
			// correct zoom after fitBounds to the current location marker
			var listener = google.maps.event.addListener(map, "idle", function () {
				if (map.getZoom() > 18) map.setZoom(18);
				google.maps.event.removeListener(listener);
			});

		});
	}




	// The map, centered at defaultPos
	let map = new google.maps.Map(
		document.querySelector('.ba-map'), {
		zoom: 16,
		center: defaultPos,
		disableDefaultUI: true
	});
	directionsRenderer.setMap(map);


	// // The marker, positioned at defaultPos
	// let marker = new google.maps.Marker({
	// 	position: defaultPos,
	// });

	// marker.setMap(map);


	let autocompleteStart = new google.maps.places.Autocomplete(inputStartPoint);
	let autocompleteDestination = new google.maps.places.Autocomplete(inputDestinationPoint);



	// displaying route
	function calcRoute() {
		const routeRequest = {
			origin: inputStartPoint.value,
			destination: inputDestinationPoint.value,
			travelMode: 'DRIVING'
		};
		directionsService.route(routeRequest, function (result, status) {
			if (status == 'OK') {
				if (error.innerHTML != '') {
					error.innerHTML = '';
				}
				directionsRenderer.setDirections(result);
			} else {
				error.innerHTML = 'Route can\'t be build';
			}
		});
	}

	// calcRoute();
	function newRoute(event) {
		event.preventDefault();
		if (marker != undefined) {
			marker.setMap(null);
		}
		calcRoute();

	}
	// call route display
	const routeForm = document.querySelector('.ba-route');
	routeForm.addEventListener('submit', newRoute);
}

const formFields = document.querySelectorAll('.ba-route input[type="text"');
const submitBtn = document.querySelector('[data-route-submit]');
submitBtn.setAttribute('disabled', true);
formFields.forEach(field => {
	field.addEventListener('change', () => {
		if (inputStartPoint.value != '' && inputDestinationPoint.value != '') {
			submitBtn.removeAttribute('disabled');
		} else {
			submitBtn.setAttribute('disabled', true);

		}
	});
});