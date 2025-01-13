// chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
//     console.log(`document loaded at ${details.timeStamp}`, `tab ID is ${details.tabId}`);
//     const tabID = details.tabId
//     chrome.scripting
//         .executeScript({
//             target: {tabId: tabID},
//             files:["script.js"]
//         })
//         .then(() => console.log("script injected"));
// })

//fetch the DOM

//examine the DOM

//send out notification if DOM fits a criteria


import fetchLocations from "./api/fetchLocation.js";

import { fetchOpenSlots } from "./api/fetchOpenSlots.js";
import { createNotification } from "./lib/createNotification.js";

const ALARM_JOB_NAME = "DROP_ALARM";

const CODE_RUNNING_FREQUENCY = 1.0;

let cachedPrefs = {};

let cachedTimeSlot = null;

chrome.runtime.onInstalled.addListener(() => {
    fetchLocations();
})


chrome.runtime.onMessage.addListener(data => {
    const {event, prefs} = data;
    switch(event){
        case 'onStop':
            handleOnStop();
            break;
        case 'onStart':
            handleOnStart(prefs);
            break;
        default:
            break; 
    }
})

const handleOnStop = ()=>{
    stopAlarm();
    setRunningStatus(false);
    cachedPrefs = {};
    cachedTimeSlot = null
    console.log(`Alarm canceled`);
}

const handleOnStart = (prefs)=>{
    console.log("On start in background");
    console.log("prefs received:", prefs);
    cachedPrefs = prefs;
    chrome.storage.local.set(prefs);
    setRunningStatus(true);
    createAlarm();
}

const setRunningStatus = (isRunning) =>{
    chrome.storage.local.set({isRunning});
}

const createAlarm = () => {
    chrome.alarms.get(ALARM_JOB_NAME, existingAlarm => {
        if(!existingAlarm){
            openSlotsJob();
            chrome.alarms.create(ALARM_JOB_NAME, {periodInMinutes: CODE_RUNNING_FREQUENCY})
        }
    })
}

const stopAlarm = ()=>{
    chrome.alarms.clearAll();
}

chrome.alarms.onAlarm.addListener(()=>{
    console.log("onAlarm schedule code running")
    openSlotsJob();
})

const openSlotsJob = () => {
    fetchOpenSlots(cachedPrefs)
        .then((data)=>{
            handleOpenSlots(data);
        })
}

const handleOpenSlots = (openSlots) => {
    if(openSlots && openSlots.length > 0 && openSlots[0].timestamp != cachedTimeSlot){
        cachedTimeSlot = openSlots[0].timestamp;
        createNotification(openSlots[0], openSlots.length, cachedPrefs);
    }
}