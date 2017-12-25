//GAME
var gravity = 1.622;
var dt = 0.016683;
var timer = null;
var timerFuel = null;
var paused = false;
var ended = false;
var heightGame = 70;

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
    },
    haveFuel: function () {
        return (this.fuel > 0);
    },
    restart: function () {
        this.height = 10;
        this.speed = 0;
        this.aceleration = -gravity;
        this.fuel = 100;
    }
};

//---------------------------------------------------

//ON READY
$(document).ready(function () {

    //CHECK LOCAL STORAGE FOR CHEATERS
    checkLocalStorage();

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

    //Buttons
    $("#btn_playPause").click(function () {
        doPause();
    });

    $("#btn_restart").click(function () {
        ended = false;
        rocket.restart();
        stop();
        start();
        doPause();
        updateFuel();
        //document.getElementById("naveImg").src = "img/rocketOff.png";
    });

    $("#btn_logout").click(function () {
        window.location.replace("./login.html");
        //Clear localstorage?
    });

    //START FALLING THE ROCKET
    start();
});

/**
 * FUNCTION DEFINITION
 */

function checkLocalStorage() {
    var url = "LoginServlet";
    var u = localStorage._userN;
    var p = localStorage._pass;
    var correct = false;
    if ((localStorage.getItem("_userN") !== null) && (localStorage.getItem("_pass") !== null)) {
        $.ajax({
            method: "POST",
            url: url,
            data: {userName: u, password: p},
            success: function (rsp) {
                correct = true;
                showToast("Welcome back " + u, "", "success", "#36B62D");
            },
            error: function (e) {
                if (e["responseJSON"] === undefined) {
                    showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
                } else {
                    showToast(e["responseJSON"]["error"], "", "error", "#D43721");
                }
            }
        });
    }
    if (!correct) {
        //window.location.replace("./login.html"); //REMOVE COMENTARY FOR WORKING
    }

}


function start() {
    //Every interval timelap move the rocket
    timer = setInterval(function () {
        moveRocket();
    }, dt * 1000);
}

function stop() {
    clearInterval(timer);
    paused = true;
}

function moveRocket() {
    if (!paused) {
        //Changes the speed and the height
        rocket.speed += rocket.aceleration * dt;
        rocket.height += rocket.speed * dt;
        //Update the scoreboard
        $("#speed").text(rocket.speed.toFixed(2));
        $("#height").text((heightGame - rocket.height).toFixed(2));

        //It will move until a 70% of the screen and checks the top of the screen
        if ((rocket.height < heightGame) && (rocket.height > 0)) {
            document.getElementById("rocket").style.top = rocket.height + "%";
        } else {
            doPause();
            ended = true;
            stop();
            //Fast check if is in the top or bottom side
            if (rocket.height > 65) {
                $("#height").text("0.00");
            } else {
                h$("#height").text("70.00");
            }
            
        }
    }
}

function motorOn() {
    if (rocket.haveFuel() && (!paused) && (!ended)) {
        rocket.aceleration = -gravity;
        if (timerFuel === null)
            timerFuel = setInterval(function () {
                rocket.updateFuel();
            }, 10);
    }
}
function motorOff() {
    if ((!paused) && (!ended)) {
        rocket.aceleration = gravity;
        clearInterval(timerFuel);
        timerFuel = null;
    }
}

function updateFuel() {
    if (rocket.haveFuel() && (!paused) && (!ended)) {
        //Decrement fuel until its 0
        rocket.fuel -= 0.1;
        if (rocket.fuel < 0)
            rocket.fuel = 0;
        $("#fuelContent")[0].style.width = rocket.fuel + "%";
    }
}

function doPause() {
    if (!ended) {
        if (!paused) {
            $(".paused").fadeIn(400);
            $("#btn_playPause > img").attr("src", "img/play.png");
        } else {
            $(".paused").fadeOut(400);
            $("#btn_playPause > img").attr("src", "img/pause.png");
        }
        paused = !paused;
    }
}


function showToast(head, text, icon, bgColor) {
    $.toast({
        text: text, // Text that is to be shown in the toast
        heading: head, // Optional heading to be shown on the toast
        icon: icon, // Type of toast icon: warning | success | error | info
        showHideTransition: 'fade', // fade, slide or plain
        allowToastClose: false, // Boolean value true or false
        hideAfter: 3000, // false to make it sticky or number representing the miliseconds as time after which toast needs to be hidden
        position: 'top-center', // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values
        textAlign: 'left', // Text alignment i.e. left, right or center
        loader: true, // Whether to show loader or not. True by default
        loaderBg: '#9EC600', // Background color of the toast loader
        bgColor: bgColor
    });
}