var gravity = 1.622;


var game = {
    gravity: gravity,
    dt: 0.016683,
    timer: null,
    timerFuel: null,
    start: function () {
        this.timer = setInterval(function () {
            rocket.moveRocket();
        }, this.dt * 1000);
    },
    stop: function () {
        clearInterval(this.timer);
    },
    motorOn: function () {
        alert(rocket.aceleration);
        alert(gravity);
        rocket.aceleration = -gravity;
        alert(rocket.aceleration);
        //mientras el motor esté activado gasta combustible
        if (this.timerFuel === null)
            this.timerFuel = setInterval(function () {
                rocket.updateFuel();
            }, 10);
    },
    motorOff: function () {
        alert("motorOff");
        rocket.aceleration = gravity;
        clearInterval(this.timerFuel);
        this.timerFuel = null;
    }
};

/**
 * OBJECT ROCKET With 2 methods
 * @returns {Rocket}
 */
var rocket = {
    fuel: 100,
    height: 10,
    speed: 0,
    aceleration: gravity,
    imgSpaceShip: "img/rocket.png",
    changeImg: function (urlImg) {
        this.imgSpaceShip = urlImg;
    },
    reset: function () {
        this.fuel = 100;
        this.height = 10;
        this.speed = 0;
    },
    moveRocket: function () {
        //Change speed and position
        this.speed += this.aceleration * game.dt;
        this.height += this.speed * game.dt;
        //Update speed and height
        $("#speed").text(this.speeedd);
        $("#height").text(this.height);
        //mover hasta que top sea un 70% de la pantalla
        if (this.height < 70) {
            document.getElementById("nave").style.top = y + "%";
        } else {
            game.stop();
        }
    },
    updateFuel: function () { //We reduce fuel until it ends
        this.fuel -= 0.1;
        if (this.fuel < 0) {
            this.fuel = 0;
        }
        $("#fuel").text(this.fuel);
    }
};

var configuration = {
    name: "Default",
    id: 0,
    difficulty: 1,
    rocket: 1,
    planet: 1,
    changeID: function (n) {
        this.id = n;
    },
    changeDifficulty: function (n) {
        this.difficulty = n;
    },
    changeRocket: function (n) {
        this.rocket = n;
    },
    changePlanet: function (n) {
        this.planet = n;
    }
};


//al cargar por completo la página...
window.onload = function () {

//    document.getElementById("showm").onclick = function () {
//        document.getElementsByClassName("c")[0].style.display = "block";
//        stop();
//    };
//    //ocultar menú móvil
//    document.getElementById("hidem").onclick = function () {
//        document.getElementsByClassName("c")[0].style.display = "none";
//        start();
//    };


    //encender/apagar el motor al hacer click en la pantalla
    document.onclick = function () {
        if (rocket.aceleration === game.gravity) {
            game.motorOn();
        } else {
            game.motorOff();
        }
    };
    
    //encender/apagar al apretar/soltar una tecla
    document.onkeydown = game.motorOn;
    document.onkeyup = game.motorOff;
    //Empezar a mover la nave justo después de cargar la página
    game.start();
};