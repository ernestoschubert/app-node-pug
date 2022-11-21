(function () {
    const lat = -27.451086;
    const lng = -58.9864521;
    const map = L.map('map-home').setView([lat, lng], 15);

    let markers = new L.FeatureGroup().addTo(map)

    let properties = []

    const filters = {
        category: '',
        price: '',
    }

    const categoriesSelect = document.querySelector('#categories')
    const pricesSelect = document.querySelector('#prices')

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    categoriesSelect.addEventListener('change', e => {
        filters.category = Number(e.target.value);
        showProperties(filterProperties());
    });

    pricesSelect.addEventListener('change', e => {
        filters.price = Number(e.target.value)
        showProperties(filterProperties());
    });

    const getProperties = async () => {
        try {
            const URL = '/api/properties';
            const response = await fetch(URL);
            properties = await response.json();

            showProperties(properties);

        } catch (error) {
            console.log(error);
        }
    };

    const showProperties = properties => {

        markers.clearLayers();

        properties.forEach((prop) => {
            const marker = new L.marker([prop?.lat, prop?.lng], {
                autoPan: true
            })
                .addTo(map)
                .bindPopup(`
                    <p class="text-indigo-600 font-bold">${prop?.category?.name}</p>
                    <h1 class="text-xl font-extrabold my-3">${prop?.title}</h1>
                    <img src="/uploads/${prop?.image}" alt=" ${prop?.title} property image"/>
                    <p class="text-gray-600 font-bold py-2">${prop?.price?.name}</p>
                    <a href="/property/${prop?.id}" class="bg-indigo-600 block p-2 text-center font-bold text-white rounded">View more</a>
                `)

            markers.addLayer(marker)
        })
    };

    const filterProperties = () => properties.filter(filterCategory).filter(filterPrice);

    const filterCategory = (prop) => filters.category ? prop.categoryId === filters.category : prop;

    const filterPrice = (prop) => filters.price ? prop.priceId === filters.price : prop;

    getProperties();

})()