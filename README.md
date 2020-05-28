# Corona News India Bot

This chat-bot built with Dialogflow, is compatible with Telegram and Google Assistant. It will soon support Whatsapp as well! 

![version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/jainvandit99/CoronaNewsBot/master/functions/package.json&label=version&query=$.version&color=brightgreen)
![Platform](https://img.shields.io/badge/platform-Google%20Assistant%20|%20Telegram%20|%20Whatsapp-blue.svg)
![dialogfloq-version](https://img.shields.io/badge/dynamic/json.svg?url=https://raw.githubusercontent.com/jainvandit99/CoronaNewsBot/master/functions/package.json&label=dialogflow&query=$.dependencies.dialogflow&color=green)
[![license](https://img.shields.io/github/license/jainvandit99/CoronaNewsBot)](LICENSE)

## Features
The bot can recognise a user's query and return results pertaining to:
* The number of cases (active, recovered or total).
* The number of new cases (delta active, delta recovered, or delta total).
* The number of deceased cases (total and delta). 

* The bot can differentiate between India, individual states and major districts in the states.

## Sample Queries
Query: **_"How many cases in India today"_**  
Response: _"There were 165385 total confirmed cases in India on 29 May"_  

Query: **_"How many active cases in India 2 days back"_**  
Response: _"There were 85844 total active cases in India on 27 May"_  

Query: **_"How many new deaths in India last friday"_**  
Response: _"There were 142 new deceased cases in India on 22 May"_  

Query: **_"How many cases in Maharashtra"_**  
Response: _"There were 59546 total cases in Maharashtra"_  

Query: **_"How many recovered cases in Pune"_**  
Response: _"There were 3242 total recovered cases in Pune"_  

Query: **_"How many new active cases in Pune"_**  
Response: _"There were 116 new active cases in Pune"_  

## Upcoming Features
* Support for history cases (time series) for state and district level.
* Whatsapp integration.
* A help section.
* A daily summary section.

## Usage
Telegram: [@CoronaNewsIndia_bot](https://t.me/CoronaNewsIndia_bot)  

## License
[Mozilla Public License - 2.0](LICENSE)

## Author
[Vandit Jain](https://www.github.com/jainvandit99)
[![GitHub followers](https://img.shields.io/github/followers/jainvandit99.svg?style=social&label=Follow&maxAge=2592000)](https://github.com/jainvandit99?tab=followers)  
[![Twitter](https://img.shields.io/twitter/follow/jainvandit99?style=social)](https://twitter.com/jainvandit99)

## Acknowledgement 
Data API: This application uses the [covid19india.org public APIs](https://api.covid19india.org/) to fetch data.
