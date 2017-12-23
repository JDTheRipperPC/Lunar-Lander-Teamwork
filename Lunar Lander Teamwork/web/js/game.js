//GAME
var gravity = 1.622;
var dt = 0.016683;
var timer = null;
var timerFuel = null;
var paused = false;

//GAMESCORES
var speedMK = null;
var heightMK = null;
var fuelMK = null;

//ROCKET
var rocket = {
    height: 10,
    speed: 0,
    fuel: 100,
    aceleration: gravity,
    motorON: function () {
        motorOn();
    },
    motorOFF: function () {
        motorOff();
    },
    updateFuel: function () {
        updateFuel();
    }
};

//---------------------------------------------------

//ON READY
$(document).ready(function () {

    speedMK = $("#speed");
    heightMK = $("#height");
    fuelMK = $("#fuel");

    //Show mobile menu
    $("#showm").click(function () {
        document.getElementsByClassName("c")[0].style.display = "block";
        stop();
    });
    //Hide mobile menu
    $("#hidem").click(function () {
        document.getElementsByClassName("c")[0].style.display = "none";
        start();
    });
    //ON/OFF motor on screen click
    $(document).click(function () {
        if (rocket.aceleration === gravity) {
            rocket.motorON();
        } else {
            rocket.motorOFF();
        }
    });
    //ON/OFF motor on key click
    $(document).keydown(function () {
        rocket.motorON();
    });
    $(document).keyup(function () {
        rocket.motorOFF();
    });

    $("#btn_playPause").click(function () {
        if (!paused) {
            $(".paused").fadeIn(400);
            $("#btn_playPause > img").attr("src","img/play.png");
        } else {
            $(".paused").fadeOut(400);
            $("#btn_playPause > img").attr("src","img/pause.png");
        }
        paused = !paused;
    });

    //START FALLING THE ROCKET
    start();
});

/**
 * FUNCTION DEFINITION
 */
function start() {
    //Every interval timelap move the rocket
    timer = setInterval(function () {
        moveRocket();
    }, dt * 1000);
}

function stop() {
    clearInterval(timer);
}

function moveRocket() {
    //Changes the speed and the height
    rocket.speed += rocket.aceleration * dt;
    rocket.height += rocket.speed * dt;
    //Update the scoreboard
    speedMK.text(rocket.speed);
    heightMK.text(rocket.height);

    //It will move until a 70% of the screen
    if (rocket.height < 70) {
        document.getElementById("rocket").style.top = rocket.height + "%";
    } else {
        stop();
    }
}

function motorOn() {
    rocket.aceleration = -gravity;
    if (timerFuel === null)
        timerFuel = setInterval(function () {
            rocket.updateFuel();
        }, 10);
}
function motorOff() {
    rocket.aceleration = gravity;
    clearInterval(timerFuel);
    timerFuel = null;
}

function updateFuel() {
    //Decrement fuel until its 0
    rocket.fuel -= 0.1;
    if (rocket.fuel < 0)
        rocket.fuel = 0;
    fuelMK.text(rocket.fuel);
}