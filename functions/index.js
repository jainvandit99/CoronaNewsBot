const functions = require('firebase-functions');
const { sessionEntitiesHelper } = require('actions-on-google-dialogflow-session-entities-plugin')
const {
    dialogflow,
    Suggestions,
    actionssdk,
    Image,
    Table,
    Carousel,
    BasicCard
  } = require('actions-on-google');
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const helperFunctions = require('./functions');
const dialogflowMain = require('dialogflow');
exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {

    const agent = new WebhookClient({request, response});
    console.log('Dialogflow Request headers: ' + JSON.stringify(request.headers));
    console.log('Dialogflow Request body: ' + JSON.stringify(request.body));

    async function welcome(agent){
        console.log("OOOO LAL ALALAALALALLAL WELCOME")
        const client = new dialogflowMain.SessionEntityTypesClient();
        const sessionEntityTypeName = agent.session + '/entityTypes/district';
        let conv = agent.conv();
        return helperFunctions.getAllDistricts().then((districtData) => {
            agent.setContext({
                name: 'global_context',
                lifespan: 99,
                parameters: {
                    districtData: districtData
                }
            });
            var areas = []
            for(var i=0; i<districtData.states.length; i++){
                areas.push(districtData.states[i])
                for(var j=0; j<districtData.districts[districtData.states[i]].length; j++){
                    areas.push(districtData.districts[districtData.states[i]][j])
                }
            }
            areas.push("India")
            console.log(areas)
            let entities = Array.from(areas).map(area => {
                return {
                value: area,
                synonyms: [area]
                }
            })
            console.log(entities)
            const sessionEntityType = {
                name: sessionEntityTypeName,
                entityOverrideMode: 'ENTITY_OVERRIDE_MODE_OVERRIDE',
                entities: entities,
                };
            const request = {
                parent: agent.session,
                sessionEntityType: sessionEntityType,
            };
            return client
            .createSessionEntityType(request)
            .then((responses) => {
                console.log('Successfully created session entity type:',
                JSON.stringify(request));
                if(agent.requestSource === agent.ACTIONS_ON_GOOGLE){
                    conv.ask("Hey, ask me number of cases or deaths in some district")
                    agent.add(conv)
                }
                agent.add("Hey, ask me number of cases or deaths in some district")
                return Promise.resolve()
            })
            .catch((error) => {
                console.error(error);
                if(agent.requestSource === agent.ACTIONS_ON_GOOGLE){
                    conv.ask("Some error has occured, try again later")
                    agent.add(conv)
                }
                agent.add("Some error has occured, try again later")
                return Promise.resolve()
            })
        })
    }
    async function totalCountIntent(agent){
        console.log("OOLALLAL LALALL AL INTENT")
        var scenario = agent.parameters.scenario;
        var district = agent.parameters.district;
        var date = agent.parameters.date;
        var isNew = agent.parameters.isNew;
        var deathorcase = agent.parameters.deathorcase;
        const global_context = agent.getContext('global_context');
        let data = global_context.parameters
        let conv = agent.conv();
        return helperFunctions.getConvForCases({
            scenario: scenario,
            district: district,
            date: date,
            isNew: isNew,
            deathorcase: deathorcase
        }, data.districtData).then((result) => {
            if(agent.requestSource === agent.ACTIONS_ON_GOOGLE){
                conv.ask(result)
                agent.add(conv)
            }else{
                agent.add(result)
            }
            return Promise.resolve();
        }).catch((error) => {
            console.error(error)
            if(agent.requestSource === agent.ACTIONS_ON_GOOGLE){
                conv.ask("Some error has occured, try again later")
                agent.add(conv)
            }else{
                agent.add("Some error has occured, try again later")
            }
            return Promise.resolve();
        })
    } 
    
    function fallback(agent){
        agent.add("I'm Sorry, I don't know how to do that yet!")
        agent.add("You can ask me number of cases or deaths in each district")
    }
    
    let intentMap = new Map();
    intentMap.set('Default Welcome Intent', welcome);
    intentMap.set('Default Fallback Intet', fallback);
    intentMap.set('totalCountIntent', totalCountIntent);
    agent.handleRequest(intentMap);
})