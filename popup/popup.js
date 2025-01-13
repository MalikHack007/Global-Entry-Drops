const locationIDElement = document.getElementById("locationID")

const startDateElement = document.getElementById("startDate")

const endDateElement = document.getElementById("endDate")

const startBtn = document.querySelector('#startBtn')

const stopBtn = document.getElementById("stopBtn")

const runningTagElem = document.getElementById('runningTag')

const stoppingTagElem = document.getElementById('stoppingTag')

const startDateWarningElem = document.getElementById('startDateError')

const endDateWarningElem = document.getElementById('endDateError')

const locationWarningElem = document.getElementById('locationIdError')

const handleOnStartState = ()=>{
    showElement(runningTagElem);
    hideElement(stoppingTagElem);
    disableElement(startBtn);
    enableElement(stopBtn);
    disableElement(locationIDElement);
    disableElement(startDateElement);
    disableElement(endDateElement);
}

const handleOnStopState = () => {
    showElement(stoppingTagElem);
    hideElement(runningTagElem);
    disableElement(stopBtn);
    enableElement(startBtn);
    enableElement(locationIDElement);
    enableElement(startDateElement);
    enableElement(endDateElement);
}


const performOnStartValidations = ()=>{
    let allFieldsValid = true;
    if(!locationIDElement.value){
        showElement(locationWarningElem);
        allFieldsValid = false;
    }
    else{
        hideElement(locationWarningElem)
    }

    if(!startDateElement.value){
        showElement(startDateWarningElem);
        allFieldsValid = false;
    }

    else{
        hideElement(startDateWarningElem)
    }

    if(!endDateElement.value){
        showElement(endDateWarningElem);
        allFieldsValid = false;
    }
    else{
        hideElement(endDateWarningElem)
    }

    return allFieldsValid;
}



startBtn.onclick = ()=> {
    const allFieldsValid = performOnStartValidations();

    if(allFieldsValid){
        const prefs = {
            locationID: locationIDElement.value,
            startDate: startDateElement.value,
            endDate: endDateElement.value,
            tzData: locationIDElement.options[locationIDElement.selectedIndex].getAttribute('data-tz')
        }
        chrome.runtime.sendMessage({event: 'onStart', prefs: prefs})
    
        handleOnStartState();
    } 

}

stopBtn.onclick = ()=> {
    handleOnStopState();
    chrome.runtime.sendMessage({event:'onStop'});
}

chrome.storage.local.get(["locationID", "startDate", "endDate", "locations", "isRunning"], (result)=>{
    const {locationID, startDate, endDate, locations, isRunning} = result;


    if(locationID){
        locationIDElement.value = locationID;
    }

    if(startDate){
        startDateElement.value = startDate;
    }

    if(endDate){
        endDateElement.value = endDate;
    }

    setLocations(locations);

    if (isRunning){
        handleOnStartState();
    }

    else{
        handleOnStopState();
    }

    console.log(`Run status ${isRunning}`)

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

const disableElement = (elem)=>{
    elem.disabled = true;
}

const enableElement = (elem)=>{
    elem.disabled = false;
}

const showElement = (elem) =>{
    elem.style.display = '';
}

const hideElement = (elem) =>{
    elem.style.display = 'none';
}