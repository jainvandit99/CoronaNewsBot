const fetch = require("node-fetch")
const Endpoints = {
    "STATE_DISTRICT_WISE": "https://api.covid19india.org/v2/state_district_wise.json",
    "STATE_DAILY": "https://api.covid19india.org/states_daily.json",
    "DISTRICT_DAILY": "https://api.covid19india.org/districts_daily.json",
    "ZONES": "https://api.covid19india.org/zones.json"
}

var districtObj;
async function getConvForCases(parameters,districtData){
     districtObj = districtData;
    return `Hmmmm: ${parameters.scenario} ${parameters.district} ${parameters.date} ${parameters.isNew}`
}

async function getAllDistricts(){
    let data = await (await fetch(Endpoints.STATE_DISTRICT_WISE,{
        method: 'GET'
    })).json()
    var districtData = {
        states: [],
        districts: {}
    }
    for(var i=0; i<data.length; i++){
        var state = data[i].state
        districtData.states.push(state)
        districtData.districts[state] = []
        for(var j=0; j<data[i].districtData.length; j++){
            districtData.districts[state].push(data[i].districtData[j]["district"])
        }
    }
    return districtData
}

async function getConvForState(parameters){

}

async function getConvForDistrict(parameters){

}

async function getConvForDeltaForState(parameters){

}

async function getConvForDeltaForDistrict(parameters){

}

async function isState(state){
    if(districtObj.states.includes(state)){
        return true
    }
    return false
}

exports.getConvForCases = getConvForCases;
exports.getAllDistricts = getAllDistricts;