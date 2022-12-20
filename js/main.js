/*const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
console.log(hoy);
document.querySelector(".fecha-actual").textContent = hoy.toDateString();*/
class Pronostico{
    constructor(fecha, horas, temperaturas, sunrise, sunset, weathercode){
        this.fecha = fecha;
        this.horas = horas;
        this.temperaturas = temperaturas;
        this.sunrise = sunrise;
        this.sunset = sunset;
        this.weathercode = weathercode;
    }
    maximaTemperatura(){
        let max;
        for (let i = 0; i < this.temperaturas.length; i+=1){
            if (i==0)
                max = this.temperaturas[i];
            else
                if (this.temperaturas[i] > max)
                    max = this.temperaturas[i];
        }
        return max;
    }
    minimaTemperatura(){
        let min;
        for (let i = 0; i < this.temperaturas.length; i+=1){
            if (i==0)
                min = this.temperaturas[i];
            else
                if (this.temperaturas[i] < min)
                    min = this.temperaturas[i];
        }
        return min;
    }
}
let seleccionarIcono = (codigo) => {
    let icono;
    if (0 || 1)
        icono = "soleado";
    if (2)
        icono = "nubosidad";
    if (codigo == 3)
        icono = "nublado";
    if (codigo == 45 || codigo == 48)
        icono = "niebla";
    if (codigo == 51 || codigo == 53 || codigo == 55)
        icono = "lluvia-ligera";
    if (codigo == 56 || codigo == 57 || codigo == 66 || codigo == 67)
        icono = "lluvia-engelante";
    if (codigo == 61 || codigo == 63 || codigo == 65)
        icono = "lluvia-ligera";
    if (codigo == 71 || codigo == 73 || codigo == 75 || codigo == 77 || codigo == 85 || codigo == 86)
        icono = "nevado";
    if (codigo == 80 || codigo == 81 || codigo == 82)
        icono = "lluvia";
    if (codigo == 95)
        icono = "tormenta";
    if (codigo == 96 || codigo == 99)
        icono = "tormenta-de-nieve";
    return icono;
}
let capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}
let renderData = (datos) => {
    // Hoy
    let localidad = datos.timezone.replace("/", ", ").replace("/", ", ");
    let temperatura = datos.current_weather.temperature;
    let fecha = datos.current_weather.time;
    fecha = new Date(fecha);
    let hora = fecha.getHours() + ":00";
    console.log(hora);
    
    let contenedorClimaHoy = document.querySelector(".clima-hoy");
    contenedorClimaHoy.querySelector(".localidad").textContent = localidad;
    contenedorClimaHoy.querySelector(".fecha-actual").textContent = fecha.toDateString();
    let contendorClimaActual = contenedorClimaHoy.querySelector(".clima-actual");
    contendorClimaActual.querySelector(".temperatura").textContent = temperatura;
    let clima = seleccionarIcono(datos.current_weather.weathercode);
    contendorClimaActual.querySelector("img").setAttribute("src", "images/"+clima+".png");
    contendorClimaActual.querySelector("img").setAttribute("alt", capitalize(clima.replace("-", " ")));
    contendorClimaActual.querySelector(".clima").textContent = capitalize(clima.replace("-", " "));
    // Pronosticos a 7 dias
    let pronosticos = [];
    let horas = [];
    let temperaturas = [];
    let j = 0;
    for (let i=0; i<168; i+=1){
        if (i % 24 == 0 || i == 0){
            horas = [];
            temperaturas = [];
            let fecha = datos.hourly.time[i];
            let sunrise = datos.daily.sunrise[j];
            let sunset = datos.daily.sunset[j];
            let weathercode = datos.daily.weathercode[j];
            if (i % 24 == 0){
                let pronostico = new Pronostico(fecha, horas, temperaturas, sunrise, sunset, weathercode);
                pronosticos.push(pronostico);
                j += 1;
            }
        }
        horas.push(datos.hourly.time[i].substring(11, 16));
        temperaturas.push(datos.hourly.temperature_2m[i]);
    }
    console.log(pronosticos);
    let contenedor = document.querySelector(".clima-proximo-dias");
    pronosticos.forEach( item => {
        let fecha = new Date(item.fecha);
        fecha = fecha.toDateString();
        contenedor.innerHTML += 
        `<section class="resumen">
            <div class="dia">${fecha.substring(0,3) + fecha.substring(7, 10)}</div>
            <div class="icono"><img src="images/${seleccionarIcono(item.weathercode)}.png" alt="${capitalize(seleccionarIcono(item.weathercode).replace("-", " "))}"></div>
            <div class="max">${item.maximaTemperatura()}</div>
            <div class="min">${item.minimaTemperatura()}</div>
        </section>`;
    });
}
fetch("https://api.open-meteo.com/v1/forecast?latitude=-24.19&longitude=-65.27&hourly=temperature_2m,relativehumidity_2m,apparent_temperature,precipitation,rain,weathercode,visibility&models=best_match&daily=weathercode,temperature_2m_max,temperature_2m_min,sunrise,sunset&current_weather=true&timezone=auto")
.then((respuesta) => {
    return respuesta.json();
})
.then((datos) => {
    console.log(datos);
    renderData(datos);
})
.catch((err) => {
    console.log(err);
})