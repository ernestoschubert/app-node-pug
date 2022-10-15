(function () {
    const lat = document.querySelector("#lat").value || -27.451086;
    const lng = document.querySelector("#lng").value || -58.9864521;
    const map = L.map('map').setView([lat, lng], 16);
    let marker;

    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // pin
    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    }).addTo(map)

    // detect pin moviment
    marker.on('moveend', function (e) {
        marker = e.target

        const position = marker.getLatLng();

        map.panTo(new L.LatLng(position.lat, position.lng))

        // get streets on pin move
        geocodeService.reverse().latlng(position, 13).run(function (error, res) {
            console.log(res)
            marker.bindPopup(res.address.LongLabel)

            document.querySelector('.street').textContent = res?.address?.Address ?? '';
            document.querySelector('#street').value = res.address.Address ?? '';
            document.querySelector('#lat').value = res.latlng.lat ?? '';
            document.querySelector('#lng').value = res.latlng.lng ?? '';
        })
    })



})()