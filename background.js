chrome.webNavigation.onDOMContentLoaded.addListener((details) => {
    console.log(`document loaded at ${details.timeStamp}`, `tab ID is ${details.tabId}`);
    const tabID = details.tabId
    chrome.scripting
        .executeScript({
            target: {tabId: tabID},
            files:["script.js"]
        })
        .then(() => console.log("script injected"));
})

//fetch the DOM

//examine the DOM

//send out notification if DOM fits a criteria


// import fetchLocations from "./api/fetchLocation.js";

// chrome.runtime.onInstalled.addListener((details) => {
//     fetchLocations();
// })


// chrome.runtime.onMessage.addListener(data => {
//     const {event, prefs} = data;
//     switch(event){
//         case 'onStop':
//             handleOnStop();
//             break;
//         case 'onStart':
//             handleOnStart(prefs);
//             break;
//         default:
//             break; 
//     }
// })

// const handleOnStop = ()=>{
//     console.log("On stop in background");
// }

// const handleOnStart = (prefs)=>{
//     console.log("On start in background");
//     console.log("prefs received:", prefs);
//     chrome.storage.local.set(prefs);
// }