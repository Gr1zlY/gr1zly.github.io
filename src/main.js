(async function() {

    const basicCountry = 'UKR';
    const fitPadding = window.innerWidth * 0.15;

    const InfoControl = L.Control.extend({
        _div: null,    
        onAdd: function(map) {
            this._div = L.DomUtil.create('div', 'country-info');
            return this._div;
        },    
        update: function ( { feature } ) {
            if(feature) {
                this._div.style.display = "block"; 
                this._div.innerHTML = `<h1>${feature.properties.name}</h1><div class="description">${feature.properties.iso_a3}</description>`;
            }
        },
        hide: function(){
            this._div.style.display = "none"; 
        },
        onRemove: function(map) {}
    });

    let controlBox = new InfoControl({ position: 'topright' });
    const map = L.map('map').setView([40, 0], 3);
    let selectedFeature = null;

    const countriesDataURL = './custom.geo.json';
    const restrictionsDataURL = './restrictions.json';


    const fetchCountriesDataPromise = fetch(countriesDataURL);
    const fetchRestrictionsDataPromise = fetch(restrictionsDataURL);

    const [countriesDataJson, restrictionsDataJson] = await Promise.all([fetchCountriesDataPromise, fetchRestrictionsDataPromise]);
    const [countriesData, restrictionsData] = await Promise.all([countriesDataJson.json(), restrictionsDataJson.json()]);

    const getJson = L.geoJson(countriesData, {
        style: (feature) => ({
            stroke: true,
            fill: true,
            fillColor: (feature.properties.iso_a3 === basicCountry) ? 'rgb(73, 209, 39)' : '#fff',
            fillOpacity: 1,
            weight: 1
        }),
        onEachFeature: (feature, layer) => {
            layer.on({
                mouseover: ({target: layer}) => {

                    if(selectedFeature !== layer){
                        layer.setStyle({
                            weight: 3,
                            color: '#666',
                            fillColor: 'rgb(73, 209, 39)'
                            //dashArray: '',
                            //fillOpacity: 0.7
                        });  
                    }                 

                    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
                        layer.bringToFront();
                    }
                },
                mouseout: ({target: layer}) => {
                    if(selectedFeature !== layer) getJson.resetStyle(layer);
                },
                click: ({target: layer}) => {

                    if(selectedFeature){
                        getJson.resetStyle(selectedFeature);
                    }

                    map.fitBounds(layer.getBounds(), {padding: [fitPadding, fitPadding]});

                    layer.setStyle({
                        weight: 3,
                        color: '#666',
                        fillColor: 'rgb(200, 209, 39)'
                        //dashArray: '',
                        //fillOpacity: 0.7
                    });

                    selectedFeature = layer;

                    controlBox.update(layer);
                }
            });
        }
    }).addTo(map);

    controlBox.addTo(map);

})();