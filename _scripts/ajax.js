function getPromise(url) {
    return new Promise(function(resolve, reject)  {
        let httpRequest = new XMLHttpRequest();
        httpRequest.open('GET', url);
        httpRequest.onload = function() {
            if (httpRequest.status == 200) {
                resolve(httpRequest.responseText);
            } else {
                reject(Error(httpRequest.status));
            }
        }
        httpRequest.send();
    })
}


function failHandler(status) {
    console.log(status);
}

function tempToF(kelvin) {
    return ((kelvin - 273.15) * 1.8 + 32).toFixed(0);
}

function successHandler(data) {
    const dataObj = JSON.parse(data);
    const weatherDiv = document.querySelector('#weather');
    const div = `
        <h2 class="top">
        <img
            src="http://openweathermap.org/img/w/${dataObj.weather[0].icon}.png"
            alt="${dataObj.weather[0].description}"
            width="50"
            height="50"
        />${dataObj.name}
        </h2>
        <p>
        <span class="tempF">${tempToF(dataObj.main.temp)}&deg;</span> | ${dataObj.weather[0].description}
        </p>
    `
    return div;
    // weatherDiv.classList.remove('hidden');
}


document.addEventListener('DOMContentLoaded', function() {
    const apiKey = 'e9b77e9788eac4dc34bce6aab6922cc2';
  //  const url = 'https://api.openweathermap.org/data/2.5/weather?q=los+angeles&APPID=' + apiKey;
    
    const weatherDiv = document.querySelector('#weather');

    const locations = [
        'los+angeles,us',
        'san+francisco,us',
        'lone+pine,us',
        'mariposa,us'
    ];

    const urls = locations.map(function(location) {
        return `https://api.openweathermap.org/data/2.5/weather?q=${location}&APPID=${apiKey}`;
    });

    // Promise.all([getPromise(urls[0]), getPromise(urls[1]), getPromise(urls[2]), getPromise(urls[3])])
    //     .then(function(responses) {
    //         return responses.map(function(response) {
    //             return successHandler(response);
    //         })
    //     })
    //     .then(function(templateLiterals) {
    //         weatherDiv.innerHTML = `<h1>Weather</h1>${templateLiterals.join('')}`
    //     })    
    //     .catch(function(status) {
    //         failHandler(status);
    //     })
    //     .finally(function() {
    //         weatherDiv.classList.remove('hidden');
    //     });   
    
    (async function() {
        let responses = [];

        try {
        // Asynchronous Calls in Parellel
        responses.push(await getPromise(urls[0]));
        responses.push(await getPromise(urls[1]));
        responses.push(await getPromise(urls[2]));
        responses.push(await getPromise(urls[3]));

        // Synchronous Calls
        let templateLiterals = responses.map(function(response) {
            return successHandler(response);
         });

         weatherDiv.innerHTML = `<h1>Weather</h1>${templateLiterals.join('')}`;


        } catch (status) {
            failHandler(status);
        } finally {
            weatherDiv.classList.remove('hidden');
        }
    })();

});
