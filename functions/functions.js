const fetch = require("node-fetch")
const Endpoints = {
    "STATE_DISTRICT_WISE": "https://api.covid19india.org/v2/state_district_wise.json",
    "STATE_DAILY": "https://api.covid19india.org/states_daily.json",
    "DISTRICT_DAILY": "https://api.covid19india.org/districts_daily.json",
    "ZONES": "https://api.covid19india.org/zones.json",
    "NATIONAL_DATA":"https://api.covid19india.org/data.json"
}
var districtObj;
const monthShortNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
async function getConvForCases(parameters,districtData){
     districtObj = districtData;
     if(parameters.district === "" || parameters.district === "India"){
        try{
            return await getCovForIndia(parameters)
        }catch (error){
            console.error(error);
        }
     }
     else if(isState(parameters.district)){
         console.log("HERE-1")
        if(parameters.isNew === ""){
            try{
                return await getCountForState(parameters)
            }catch (error){
                console.log(error)
            }
        }else{
            try{
                return await getConvForStateDelta(parameters)
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
        }else{
            try{
                return await getConvForDistrictDelta(parameters)
            }catch (error){
                console.log(error)
            }
        }
     }
    return `Hmmmm: ${parameters.scenario} ${parameters.district} ${parameters.date} ${parameters.isNew}`
}

async function getCovForIndia(parameters){
    var date = parameters.date
    if(date === ""){
        date = new Date().toISOString()
    }
    let dateObj = new Date(date)
    var dateString = dateObj.getDate() + " " + monthShortNames[dateObj.getMonth()];
    let data = await (await fetch(Endpoints.NATIONAL_DATA,{
        method: 'GET'
    })).json()
    console.log(`dateString: ${dateString}`)
    console.log(`data: ${data}`)
    var today = new Date().toISOString().substring(0,10)
    if(parameters.date === "" || parameters.date.substring(0,10) === today){
        var dayDatas = data.statewise.filter((singleDayData) => {
            return singleDayData.state === "Total"
        })
        if(parameters.isNew === ""){
            if(parameters.deathorcase === "Death"){
                return `There are ${dayDatas[0].deaths} total deceased in India, today`
            }else {
                if(parameters.scenario === "" || parameters.scenario === "total"){
                    return `There are ${dayDatas[0].confirmed} confirmed total cases in India, today`
                }else if(parameters.scenario === "recovered"){
                    return `There are ${dayDatas[0].recovered} total recovered cases in India, today`
                }else {
                    return `There are ${dayDatas[0].active} total active cases in India, today`
                }
            }
        }else{
            if(parameters.deathorcase === "Death"){
                return `There are ${dayDatas[0].deltadeaths} new deceased cases in India, today`
            }else {
                if(parameters.scenario === "" || parameters.scenario === "total"){
                    return `There are ${dayDatas[0].deltaconfirmed} new cases in India, today`
                }else if(parameters.scenario === "recovered"){
                    return `There are ${dayDatas[0].deltarecovered} new recovered cases in India, today`
                }else {
                    let active = Number(dayDatas[0].deltaconfirmed) - Number(dayDatas[0].deltarecovered) - Number(dayDatas[0].deltadeaths)
                    return `There are ${active} new active cases in India, today`
                }
            }
        }
    }else{
        var i = 0;
        var dayData = data.cases_time_series.filter((singleDayData) => {
            return singleDayData.date.trim() === dateString
        })
        if(dayData.length === 0){
            dateString = (dateObj.getDate() - 1) + " " + monthShortNames[dateObj.getMonth()];
            dayData = data.cases_time_series.filter((singleDayData) => {
                return singleDayData.date.trim() === dateString
            })
        }
        console.log(`dayData: ${dayData}`)
        if(parameters.isNew === ""){
            if(parameters.deathorcase === "Death"){
                return `There were ${dayData[0].totaldeceased} total deceased in India on ${dateString}`
            }else {
                if(parameters.scenario === "" || parameters.scenario === "total"){
                    return `There were ${dayData[0].totalconfirmed} total confirmed cases in India on ${dateString}`
                }else if(parameters.scenario === "recovered"){
                    return `There were ${dayData[0].totalrecovered} total recovered cases in India on ${dateString}`
                }else {
                    let active = Number(dayData[0].totalconfirmed) - Number(dayData[0].totalrecovered) - Number(dayData[0].totaldeceased)
                    return `There were ${active} total active cases in India on ${dateString}`
                }
            }
        }else{
            if(parameters.deathorcase === "Death"){
                return `There were ${dayData[0].dailydeceased} new deceased cases in India on ${dateString}`
            }else {
                if(parameters.scenario === "" || parameters.scenario === "total"){
                    return `There were ${dayData[0].dailyconfirmed} new cases in India on ${dateString}`
                }else if(parameters.scenario === "recovered"){
                    return `There were ${dayData[0].dailyrecovered} new recovered cases in India on ${dateString}`
                }else {
                    let active = Number(dayData[0].dailyconfirmed) - Number(dayData[0].dailyrecovered) - Number(dayData[0].dailydeceased)
                    return `There were ${active} new active cases in India on ${dateString}`
                }
            }
        }
    }
    
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
            return `There were ${stateData[0].deaths} total deceased in ${parameters.district}`
        }else {
            if(parameters.scenario === "" || parameters.scenario === "total"){
                return `There were ${stateData[0].confirmed} total cases in ${parameters.district}`
            }else if(parameters.scenario === "recovered"){
                return `There were ${stateData[0].recovered} total recovered cases in ${parameters.district}`
            }else {
                return `There were ${stateData[0].active} total active cases in ${parameters.district}`
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
            return `There were ${districtData[0].deceased} total deceased in ${parameters.district}`
        }else {
            if(parameters.scenario === "" || parameters.scenario === "total"){
                return `There were ${districtData[0].confirmed} total confirmed cases in ${parameters.district}`
            }else if(parameters.scenario === "recovered"){
                return `There were ${districtData[0].recovered} total recovered cases in ${parameters.district}`
            }else {
                return `There were ${districtData[0].active} total active cases in ${parameters.district}`
            }
        }
    }catch (error){
        console.log(error);
    }
    return "0"
}

async function getConvForStateDelta(parameters){
    var today = new Date().toISOString().substring(0,10)
    if(parameters.date === "" || parameters.date.substring(0,10) === today){
        try {
            return await getConvForStateDeltaToday(parameters);
        }catch (error){
            console.error(error)
            return "0"
        }
    }
    return "0"
    
}

async function getConvForDistrictDelta(parameters){
    var today = new Date().toISOString().substring(0,10)
    if(parameters.date === "" || parameters.date.substring(0,10) === today){
        try {
            return await getConvForDistrictDeltaToday(parameters);
        }catch (error){
            console.error(error)
            return "0"
        }
    }
    return "0"
    
}

async function getConvForDistrictDeltaToday(parameters){
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
            return `There were ${districtData[0].delta.deceased} new deceased in ${parameters.district}`
        }else {
            if(parameters.scenario === "" || parameters.scenario === "total"){
                return `There were ${districtData[0].delta.confirmed} new confirmed cases in ${parameters.district}`
            }else if(parameters.scenario === "recovered"){
                return `There were ${districtData[0].delta.recovered} new recovered cases in ${parameters.district}`
            }else {
                let active = Number(districtData[0].delta.confirmed) - Number(districtData[0].delta.deceased) - Number(districtData[0].delta.recovered)
                return `There were ${active} new active cases in ${parameters.district}`
            }
        }
    }catch (error){
        console.log(error);
    }
    return "0"
}

async function getConvForStateDeltaToday(parameters){
    try{
        let data = await( await fetch(Endpoints.NATIONAL_DATA,{
            method: 'GET'
        })).json();
        let stateData = await data.statewise.filter((statedata) => {
            return statedata.state === parameters.district
        })
        console.log(stateData);
        if(parameters.deathorcase === "Death"){
            return `There are ${stateData[0].deltadeaths} new deceased in ${parameters.district}`
        }else {
            if(parameters.scenario === "" || parameters.scenario === "total"){
                return `There are ${stateData[0].deltaconfirmed} new cases in ${parameters.district}`
            }else if(parameters.scenario === "recovered"){
                return `There are ${stateData[0].deltarecovered} new recovered cases in ${parameters.district}`
            }else {
                let active = Number(stateData[0].deltaconfirmed) - Number(stateData[0].deltadeaths) - Number(stateData[0].deltarecovered)
                return `There are ${active} new active cases in ${parameters.district}`
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