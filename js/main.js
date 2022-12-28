let quitarEspacios = (string) => {
    let newString = "";
    for (let i = 0; i < string.length; i+=1){
        if ([string[i]] == " "){
            newString += "%20";
        }
        else{
            newString += string[i];
        }
    }
    return newString;
}
let datetimeFormatter = (datetime) => {
    let date = new Date(datetime);
    date = date.toDateString();
    return date.substring(0, 3) + " " + date.substring(8, 10);
}
let setAddress = (address) => {
    document.querySelector(".clima-hoy").querySelector(".localidad").textContent = address;
}
let setCurrentTime = (date, datetime) => {
    document.querySelector(".fecha-actual").textContent = datetimeFormatter(date);
    document.querySelector(".clima-hoy").querySelector(".hora-actual").textContent = datetime;
}
let setActualConditions = (currentConditions, datos) => {
    let currentConditionsContainerHtml = document.querySelector(".clima-hoy");
    // set icon
    currentConditionsContainerHtml.querySelector("img").setAttribute("src", `images/${currentConditions.icon}.png`);
    currentConditionsContainerHtml.querySelector("img").setAttribute("alt", `${currentConditions.icon}`);
    // set current condition
    currentConditionsContainerHtml.querySelector(".condicion").textContent = currentConditions.conditions;
    // set current temperature
    currentConditionsContainerHtml.querySelector(".temperatura").querySelector(".real").textContent = currentConditions.temp + " ºF";
    // set current feelslike temperature
    currentConditionsContainerHtml.querySelector(".temperatura").querySelector(".sensacion-termica").textContent = "Sensación termica: " + currentConditions.feelslike + " ºF";
    // set current windspeed
    currentConditionsContainerHtml.querySelector(".vientos").textContent = currentConditions.windspeed + " mph";
    // set current humidity
    currentConditionsContainerHtml.querySelector(".humedad").textContent = currentConditions.humidity + "%";
    // set current visibility
    currentConditionsContainerHtml.querySelector(".visibilidad").textContent = currentConditions.visibility + " mi";
    // set current precipitation probably
    currentConditionsContainerHtml.querySelector(".precipitaciones").textContent = currentConditions.precipprob + "%";
    // set sunrise time's
    currentConditionsContainerHtml.querySelector(".sunrise").textContent = currentConditions.sunrise.substring(0,5);
    // set sunset time's
    currentConditionsContainerHtml.querySelector(".sunset").textContent = currentConditions.sunset.substring(0,5);
    // set today's max and min temperature
    currentConditionsContainerHtml.querySelector(".max").textContent = datos.days[0].tempmax + " ºF";
    currentConditionsContainerHtml.querySelector(".min").textContent = datos.days[0].tempmin + " ºF";
    // set hourly temperatures
    datos.days[0].hours.forEach(hour => {
        if (hour.datetime >= datos.currentConditions.datetime){
            currentConditionsContainerHtml.querySelector(".horas").innerHTML += 
            `<div class="hora">
                <span>${hour.datetime.substring(0,5)}</span>
                <span>${hour.temp}ºF</span>
                <img src="images/${hour.icon}.png" alt="${hour.icon}" width="40px" heigth="40px">
            </div>
            `;
        }
    });
}
let setNextDaysConditions = (nextDaysconditions) => {
    let summary = document.querySelector(".clima-proximos-dias");
    nextDaysconditions.forEach(dayConditions => {
        summary.innerHTML += `
        <section class="resumen">
            <div class="dia">${datetimeFormatter(dayConditions.datetime)}</div>
            <div class="icono"><img src="images/${dayConditions.icon}.png" alt="${dayConditions.icon}"></div>
            <div class="max">${dayConditions.tempmax}ºF</div>
            <div class="min">${dayConditions.tempmin}ºF</div>
        </section>
        `;
    });
}
let renderizarDatos = (datos) => {
    setAddress(datos.resolvedAddress);
    setCurrentTime(datos.days[0].datetime,datos.currentConditions.datetime);
    setActualConditions(datos.currentConditions, datos);
    setNextDaysConditions(datos.days);
}
let realizarPeticion = (ciudad) => {
    fetch(`https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${ciudad}?unitGroup=us&include=events%2Calerts%2Chours%2Cdays%2Ccurrent&key=49X5ESKFZK4SFTZWCHM6EFAAA&contentType=json`)
    .then((respuesta) => {
        return respuesta.json();
    })
    .then((datos) => {
        console.log(datos);
        renderizarDatos(datos);
    })
    .catch((err) => {
        console.log(err);
    })
}

if (localStorage.getItem("ciudad") != undefined){
    let ciudad = localStorage.getItem("ciudad");
    document.querySelector(".pop-up-container").style.display = "none";
    realizarPeticion(quitarEspacios(ciudad));
}
else{
    document.querySelector(".form-seleccionar-ciudad").addEventListener("submit",(e) => {
        e.preventDefault();
        let ciudadIngresada = document.querySelector("#ciudad").value;
        document.querySelector(".pop-up-container").style.display = "none";
        localStorage.setItem("ciudad", ciudadIngresada);
        realizarPeticion(quitarEspacios(ciudad));
    });
}

