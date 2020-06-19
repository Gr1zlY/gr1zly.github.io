const fetch = require("node-fetch");
const fs = require('fs');

const geo = "http://127.0.0.1:8080/custom.min.geojson"
const url = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQtjw29E0eRQsOFH0ReMrxRU4k7l7gn_l0KyfCxp-Yaxge8IXpvSuhKfeb8Ukik6PQZqpdts2n11rSC/pub?gid=1493408390&single=true&output=tsv";

const getData = async url => {

    const [responseResrictions, resposeGeo] = await Promise.all([fetch(url), fetch(geo)]);
    const [restrictionsStr, features] = await Promise.all([responseResrictions.text(), resposeGeo.json()]);

    const restrictionsMap = new Map();

    const restrinctionsRows = restrictionsStr.split(/\r?\n/).map(element => element.split('\t').map(cell => cell.trim())).map(element => {
        restrictionsMap.set(element[1], {
            name: element[2],
            prohibited: (!!element[4] && element[4].length > 0) ? element[4] : null,
            open: (!!element[5] && element[5].length > 0) ? element[5] : null,
            restricted: (!!element[6] && element[6].length > 0) ? element[6] : null,
            source: (!!element[7] && element[7].length > 0) ? element[7] : null,
            open_on: (!!element[8] && element[8].length > 0) ? element[8] : null,
        });
    });

    //for(const row of restrictionsStr){

    for(const feature of features.features){
        //console.log(feature.properties.iso_a3);
        //for(const row of restrictions){

        //}
        const iso = feature.properties.iso_a3;
        if(iso && restrictionsMap.has(iso)){
            const countryData = restrictionsMap.get(iso);
            feature.properties = {...feature.properties, ...countryData};
        }
    }

    let data = JSON.stringify(features);
    fs.writeFileSync('data.json', data);

    //console.log(json);
};

getData(url);