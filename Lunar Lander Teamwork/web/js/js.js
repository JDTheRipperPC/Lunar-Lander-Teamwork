
//ENTORNO
var g = 1.622;
var dt = 0.016683;
var timer = null;
var timerFuel = null;
var Rocket;
//NAVE
var y = 10; // altura inicial y0=10%, debe leerse al iniciar si queremos que tenga alturas diferentes dependiendo del dispositivo
var v = 0;
var c = 100;
var a = g; //la aceleración cambia cuando se enciende el motor de a=g a a=-g (simplificado)
//MARCADORES
var velocidad = null;
var altura = null;
var combustible = null;


/**
 * OBJECT ROCKET With 2 methods
 * @returns {Rocket}
 */
var rocket = {
    fuel: 100,
    height: 10,
    speed: 0,
    imgSpaceShip: "img/rocket.png",
    changeImg: function (urlImg) {
        this.imgSpaceShip = urlImg;
    },
    reset: function () {
        this.fuel = 100;
        this.height = 10;
        this.speed = 0;
    }
};

var configuration = {
    dificultad: 1,
    nave: 1,
    luna: 1
};



//al cargar por completo la página...
window.onload = function () {

    alert(rocket.fuel);
    rocket.reset();
    alert(rocket.fuel);

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
        if (a == g) {
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
    v += a * dt;
    y += v * dt;
    //actualizar marcadores
    velocidad.innerHTML = v;
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
    a = -g;
    //mientras el motor esté activado gasta combustible
    if (timerFuel == null)
        timerFuel = setInterval(function () {
            actualizarFuel();
        }, 10);
}
function motorOff() {
    a = g;
    clearInterval(timerFuel);
    timerFuel = null;
}
function actualizarFuel() {
    //Restamos combustible hasta que se agota
    c -= 0.1;
    if (c < 0)
        c = 0;
    combustible.innerHTML = c;
}
