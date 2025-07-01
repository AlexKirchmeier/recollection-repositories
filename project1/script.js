// Initialize a map with Leaflet.js and set it to University of Washington, Seattle campus
var map = L.map('map').setView([47.655548, -122.303200], 15);

// Add a tile layer to the map (Mapbox Streets layer)
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: 'Map &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
    maxZoom: 20,
    minZoom: 13,
    tileSize: 512,
    zoomOffset: -1
}).addTo(map);

// Add a contextmenu event listener (right-click)
map.on('contextmenu', function(e) {
    // Get the geographic coordinates from the event
    var lat = e.latlng.lat;
    var lng = e.latlng.lng;

    // Construct the prefilled form URL
    var formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSe3Zo7rH_M0lJSbLNauGVofH0N2SyfRF1MkiN3yfgn4LbYIzw/viewform?usp=pp_url';
    formUrl += '&entry.218879152=' + lat;
    formUrl += '&entry.286841023=' + lng;

    // Create a popup at the clicked location with a link to the form
    var popup = L.popup()
        .setLatLng(e.latlng)
        .setContent('<a href="' + formUrl + '" target="_blank">Add Recollection</a>')
        .openOn(map);
});

// Fetch data from Google Spreadsheet
fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vTHnXKfpCWnwV8D3-IFSG0ytBd-o0keAmnJoX1Yknmnic9PCT5q77eBgdVhrxMQh4BteODT6J2DYB6K/pub?output=csv')
    .then(response => response.text())
    .then(data => {
        // Parse the CSV data
        let csvData = Papa.parse(data, {header: true}).data;

        // Iterate over each row in the data
        for (let row of csvData) {
            // Get the latitude and longitude from the row
            let lat = row['Latitude'];
            let lng = row['Longitude'];
            let placename = row['Place-name'];
            let date = row['Date'];
            // let experience = row['Share your experience in this place'];
            // let sentiment = row['Was the experience...'];

            let color = (row["Color"]).toString()
            if (!color) {
                color = "gray"
            }

            // Add a circleMarker to the map at the latitude and longitude
            L.circleMarker([lat, lng], { color: color }).addTo(map)
                .bindPopup(`<b>${placename}</b><br>${date}`);
        }
    });
