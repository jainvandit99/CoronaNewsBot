const fetch = require("node-fetch")
const Endpoints = {
    "STATE_DISTRICT_WISE": "https://api.covid19india.org/v2/state_district_wise.json",
    "STATE_DAILY": "https://api.covid19india.org/states_daily.json",
    "DISTRICT_DAILY": "https://api.covid19india.org/districts_daily.json",
    "ZONES": "https://api.covid19india.org/zones.json",
    "NATIONAL_DATA":"https://api.covid19india.org/data.json"
}

var districtObj;
async function getConvForCases(parameters,districtData){
     districtObj = districtData;
     if(isState(parameters.district)){
         console.log("HERE-1")
        if(parameters.isNew === ""){
            try{
                return await getCountForState(parameters)
            }catch (error){
                console.log(error)
            }
        }
     }else{
        console.log("HERE-2")
        if(parameters.isNew === ""){
            try{
                return await getCountForDistrict(parameters)
            }catch (error){
                console.log(error)
            }
        }
     }
    return `Hmmmm: ${parameters.scenario} ${parameters.district} ${parameters.date} ${parameters.isNew}`
}

async function getAllDistricts(){
    console.log("Logged Get ALl Districts")
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
    console.log('district data: ' + districtData)
    return districtData
}

function isState(state){
    if(districtObj.states.includes(state)){
        console.log("true")
        return true
    }
    console.log("false")
    return false
}

async function getCountForStateToday(parameters){
    try{
        let data = await( await fetch(Endpoints.NATIONAL_DATA,{
            method: 'GET'
        })).json();
        let stateData = await data.statewise.filter((statedata) => {
            return statedata.state === parameters.district
        })
        console.log(stateData);
        if(parameters.deathorcase === "Death"){
            return `There are ${stateData[0].deaths} deceased in ${parameters.district}`
        }else {
            if(parameters.scenario === "" || parameters.scenario === "total"){
                return `There are ${stateData[0].confirmed} cases in ${parameters.district}`
            }else if(parameters.scenario === "recovered"){
                return `There are ${stateData[0].recovered} recovered cases in ${parameters.district}`
            }else {
                return `There are ${stateData[0].active} active cases in ${parameters.district}`
            }
        }
    }catch (error){
        console.log(error);
    }
    return "0"
}

async function getCountForState(parameters){
    var today = new Date().toISOString().substring(0,10)
    if(parameters.date === "" || parameters.date.substring(0,10) === today){
        try{
            return await getCountForStateToday(parameters);
        }catch (error){
            console.log(console.error());
        }
    }
    return "0"
}

async function getCountForDistrict(parameters){
    var today = new Date().toISOString().substring(0,10)
    console.log("GET COUNT FOR DISTRICT CALLED")
    if(parameters.date === "" || parameters.date.substring(0,10) === today){
        try{
            return await getCountForDistrictToday(parameters);
        }catch (error){
            console.log(console.error());
        }
    }
    return "0"
}

async function getCountForDistrictToday(parameters){
    try{
        let data = await( await fetch(Endpoints.STATE_DISTRICT_WISE,{
            method: 'GET'
        })).json();
        let stateData = await data.filter((statedata) => {
            return statedata.state === getState(parameters.district)
        })
        let districtData = await stateData[0].districtData.filter((district) => {
            return district.district === parameters.district
        })
        console.log(`data: ${data}`)
        console.log(`stateData: ${stateData}`)
        console.log(`districtData: ${districtData}`);
        if(parameters.deathorcase === "Death"){
            return `There are ${districtData[0].deceased} deceased in ${parameters.district}`
        }else {
            if(parameters.scenario === "" || parameters.scenario === "total"){
                return `There are ${districtData[0].confirmed} cases in ${parameters.district}`
            }else if(parameters.scenario === "recovered"){
                return `There are ${districtData[0].recovered} recovered cases in ${parameters.district}`
            }else {
                return `There are ${districtData[0].active} active cases in ${parameters.district}`
            }
        }
    }catch (error){
        console.log(error);
    }
    return "0"
}

function getState(district){
    console.log('GET STATE')
    for (var state in districtObj.districts){
        if(districtObj.districts[state].includes(district)){
            console.log(`STATE: ${state}`)
            return state;
        }
    }
    return ""
}

exports.getConvForCases = getConvForCases;
exports.getAllDistricts = getAllDistricts;