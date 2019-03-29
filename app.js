window.addEventListener('load', ()=> {
    //when the window loads, take this action
    let long;
    let lat;
    let temperatureDescription = document.querySelector('.temperature-description');
    let temperatureDegree = document.querySelector('.temperature-degree');
    let locationTimeZone = document.querySelector('.location-timezone');
    let temperatureSection = document.querySelector('.temperature');
    const temperatureSpan = document.querySelector('.temperature span');
    
    //if the geolocation exists in the browser...
    if (navigator.geolocation) {
        //then get the user's position
        navigator.geolocation.getCurrentPosition(position =>{
            long = position.coords.longitude;
            lat = position.coords.latitude;

            //proxy tunnel needed so that we can make API calls from the local host
            const proxy = 'https://cors-anywhere.herokuapp.com/';
            // now we need somewhere to get the weather data from
            const api = `${proxy}https://api.darksky.net/forecast/851045a2b8bb46c103ab5aaf75239b26/${lat},${long}`;
        
            // fetch the data...
            fetch(api)
            //and then run these commands ONLY after all of the data comes
            .then(response =>{
                return response.json();
            })
            //then when the response is converted to json data...
            .then(data => {
                //console.log(data); use this to view the api data
                //access the "currently" portion from the json data
                const {temperature, summary, icon} = data.currently;
                
                //set DOM elements from the API
                temperatureDegree.textContent = temperature;
                temperatureDescription.textContent = summary;
                locationTimeZone.textContent = data.timezone;
                //formula for celsius
                let celsius = (temperature - 32) * (5/9);
                
                //set icon
                setIcons(icon, document.querySelector('.icon'));

                //on click, change to celsius/farenheit
                temperatureSection.addEventListener('click', () => {
                    if (temperatureSpan.textContent === "F") {
                        temperatureSpan.textContent = "C";
                        temperatureDegree.textContent = Math.floor(celsius)
                    } else {
                        temperatureSpan.textContent = "F";
                        temperatureDegree.textContent = temperature;

                    }
                });
            });
        });
    }

    function setIcons(icon, iconID){
        const skycons = new Skycons({color: "white"});
        const currentIcon = icon.replace(/-/g, "_").toUpperCase();//replace every line with an underscore so we can use our skycons
        skycons.play();
        return skycons.set(iconID, Skycons[currentIcon]);
    }
});