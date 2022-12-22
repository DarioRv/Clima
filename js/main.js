let datetimeFormatter = (datetime) => {
    let date = new Date(datetime);
    date = date.toDateString();
    console.log(date);
    return date.substring(0, 3) + " " + date.substring(8, 10);
}
let setAddress = (address) => {
    document.querySelector(".clima-hoy").querySelector(".localidad").textContent = address;
}
let setCurrentTime = (address) => {
    document.querySelector(".clima-hoy").querySelector(".hora-actual").textContent = address;
}
let setActualConditions = (currentConditions, datos) => {
    let currentConditionsContainerHtml = document.querySelector(".clima-hoy");
    // set current temperature
    currentConditionsContainerHtml.querySelector(".temperatura").textContent = currentConditions.temp + "ºF";
    // set current condition
    currentConditionsContainerHtml.querySelector(".clima").textContent = currentConditions.conditions;
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
    currentConditionsContainerHtml.querySelector(".max").textContent = datos.days[0].tempmax;
    currentConditionsContainerHtml.querySelector(".min").textContent = datos.days[0].tempmin;
    // set hourly temperatures
    datos.days[0].hours.forEach(hour => {
        if (hour.datetime > datos.currentConditions.datetime){
            currentConditionsContainerHtml.querySelector(".horas").innerHTML += 
            `<div class="hora">
                <span>${hour.datetime.substring(0,5)}</span>
                <span>${hour.temp}ºF</span>
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
    setCurrentTime(datos.currentConditions.datetime);
    setActualConditions(datos.currentConditions, datos);
    setNextDaysConditions(datos.days);
}
fetch("https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/san%20salvador%20de%20jujuy?unitGroup=us&include=events%2Calerts%2Chours%2Cdays%2Ccurrent&key=49X5ESKFZK4SFTZWCHM6EFAAA&contentType=json")
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