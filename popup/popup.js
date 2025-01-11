const locationIDElement = document.getElementById("locationID")

const startDateElement = document.getElementById("startDate")

const endDateElement = document.getElementById("endDate")

const startBtn = document.querySelector('#startBtn')

const stopBtn = document.getElementById("stopBtn")



startBtn.onclick = ()=> {
    const prefs = {
        locationID: locationIDElement.value,
        startDate: startDateElement.value,
        endDate: endDateElement.value,
        tzData: locationIDElement.options[locationIDElement.selectedIndex].getAttribute('data-tz')
    }
    chrome.runtime.sendMessage({event: 'onStart', prefs: prefs})

}

stopBtn.onclick = ()=> {
    
    chrome.runtime.sendMessage({event:'onStop'});
}

chrome.storage.local.get(["locationID", "startDate", "endDate", "locations"], (result)=>{
    const {locationID, startDate, endDate, locations} = result;

    setLocations(locations);

    if(locationID){
        locationIDElement.value = locationID;
    }

    if(startDate){
        startDateElement.value = startDate;
    }

    if(endDate){
        endDateElement.value = endDate;
    }

})

const setLocations = (locations) =>{
    locations.forEach(location => {
        let optionElement = document.createElement("option");
        optionElement.value = location.id
        optionElement.innerHTML = location.name
        optionElement.setAttribute('data-tz', location.tzData)
        locationIDElement.appendChild(optionElement)
    })
}