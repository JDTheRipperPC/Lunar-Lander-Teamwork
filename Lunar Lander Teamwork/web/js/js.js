//ENTORNO
var gravity = 1.622;
var dt = 0.016683;
var timer = null;
var timerFuel = null;

//NAVE
var y = 10; // altura inicial y0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
var speed = 0;
var fuel = 100;
var aceleration = gravity; //la aceleración cambia cuando se enciende el motor de a=g a a=-g (simplificado)



//MARCADORES
var velocidad = null;
var altura = null;
var combustible = null;

//al cargar por completo la página...
window.onload = function () {

    velocidad = document.getElementById("velocidad");
    altura = document.getElementById("altura");
    combustible = document.getElementById("fuel");

    //definición de eventos
    //mostrar menú móvil
    document.getElementById("showm").onclick = function () {
        document.getElementsByClassName("c")[0].style.display = "block";
        stop();
    }
    //ocultar menú móvil
    document.getElementById("hidem").onclick = function () {
        document.getElementsByClassName("c")[0].style.display = "none";
        start();
    }
    //encender/apagar el motor al hacer click en la pantalla
    document.onclick = function () {
        if (aceleration === gravity) {
            motorOn();
        } else {
            motorOff();
        }
    }
    //encender/apagar al apretar/soltar una tecla
    document.onkeydown = motorOn;
    document.onkeyup = motorOff;

    //Empezar a mover la nave justo después de cargar la página
    start();
}

//Definición de funciones
function start() {
    //cada intervalo de tiempo mueve la nave
    timer = setInterval(function () {
        moverNave();
    }, dt * 1000);
}

function stop() {
    clearInterval(timer);
}

function moverNave() {
    //cambiar velocidad y posicion
    speed += aceleration * dt;
    y += speed * dt;
    //actualizar marcadores
    velocidad.innerHTML = speed;
    altura.innerHTML = y;

    //mover hasta que top sea un 70% de la pantalla
    if (y < 70) {
        document.getElementById("nave").style.top = y + "%";
    } else {
        stop();
    }
}
function motorOn() {
    //el motor da aceleración a la nave
    aceleration = -gravity;
    //mientras el motor esté activado gasta combustible
    if (timerFuel == null)
        timerFuel = setInterval(function () {
            actualizarFuel();
        }, 10);
}
function motorOff() {
    aceleration = gravity;
    clearInterval(timerFuel);
    timerFuel = null;
}
function actualizarFuel() {
    //Restamos combustible hasta que se agota
    fuel -= 0.1;
    if (fuel < 0)
        fuel = 0;
    combustible.innerHTML = fuel;
}