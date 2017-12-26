//GAME
var gravity = 1.622;
var dt = 0.016683;
var timer = null;
var timerFuel = null;
var paused = true;
var ended = false;
var heightGame = 70;
var imgRocketOFF = ["img/rocket1ON.png", "img/rocket2ON.gif"];
var imgRocketON = ["img/rocket1ON.png", "img/rocket2ON.gif"];
var imgRocketBreak = ["img/rocket1Break.gif", "img/rocket2Break.gif"];
var imgMoon = ["img/moonGray.png", "img/moonYellow.png"];
var configurations = [];
var fuelLevel = 100;
var userName;

//ROCKET
var rocket = {
    height: 10,
    speed: 0,
    fuel: fuelLevel,
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
        this.fuel = fuelLevel;
    }
};

//CONFIGURATION 
function ConfigurationClass(id_conf, name, diff, rocket, moon) {
    this.id = id_conf;
    this.name = name;
    this.difficulty = diff;
    this.rocketModel = rocket;
    this.moonModel = moon;
}

var configuration = {
    id_conf: "-1",
    name: "Default",
    difficulty: 0,
    rocketModel: 0,
    moonModel: 0
};

//---------------------------------------------------

//ON READY
$(document).ready(function () {

    //CHECK LOCAL STORAGE FOR CHEATERS
    checkStorage();

    loadConfigurations();
    //
    //EVENTS RELATED WITH THE MODAL:
    //START CLICKS NAV--------------------
    $('.nav li').click(function (e) {
        $('.nav li.active').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
        e.preventDefault();
        hideContents();
    });
    $("#nav_configuration").click(function () {
        $("#set_configuration").show();
    });
    $("#nav_scores").click(function () {
        $("#set_scores").show();
    });
    $("#nav_players").click(function () {
        $("#set_players").show();
    });
    $("#nav_ranking").click(function () {
        $("#set_ranking").show();
    });
    $("#nav_instructions").click(function () {
        $("#set_instructions").show();
    });
    $("#nav_about").click(function () {
        $("#set_about").show();
    });

    $("#btn_newC").click(function () {
        $("#load_configurationContainer").fadeOut(300, function () {
            $("#new_configurationContainer").fadeIn(300);
        });
    });
    $("#btn_cancelC").click(function () {
        $("#new_configurationContainer").fadeOut(300, function () {
            $("#load_configurationContainer").fadeIn(300);
        });
    });

    //Event for load a configuration
    $("#btn_load").click(function () {
        if (checkThereAreConfigurations()) {
            loadSelectedConfiguration();
            $("#modal_Settings").modal("hide");
            restart();
        }
    });

    //Event for delete a configuration
    $("#btn_deleteC").click(function () {
        if ($("#sel_configurations option:selected").index() !== -1) {
            $("#modal_confirmation").modal("show");
        }
    });
    
    $("#btn_acceptDelete").click(function (){
        deleteSelectedConfiguration(); 
        $("#modal_confirmation").modal("hide");
    });
    $("#btn_cancelDelete").click(function (){
        $("#modal_confirmation").modal("hide");
    });

    //Event Submit for new configuration
    $("#formNewConf").submit(function () {
        saveNewConfiguration();
        $("#new_configurationContainer").fadeOut(300, function () {
            $("#load_configurationContainer").fadeIn(300);
        });
        return false;
    });

    $("#btnCloseModal").click(function () {
        if (checkThereAreConfigurations()) {
            loadSelectedConfiguration();
            $("#modal_Settings").modal("hide");
            restart();
        }
    });

    //END OF CLICKS NAV-------------------

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
        restart();
//        ended = false;
//        rocket.restart();
//        stop();
//        start();
//        doPause();
//        updateFuel();
//        $("#rocket > img").attr("src", imgRocketOFF[configuration.rocketModel]);
//        //document.getElementById("naveImg").src = "img/rocketOff.png";
    });

    $("#btn_settings").click(function () {
        $("#modal_Settings").modal("show");
    });

    $("#btn_logout").click(function () {
        window.location.replace("./login.html");
    });

    $("#modal_Settings").modal("show");

    start();
});

/**
 * FUNCTION DEFINITION
 */

function checkStorage() {
    var url = "LoginServlet";
    var u = localStorage._userN;
    var p = localStorage._pass;
    var us = sessionStorage.getItem("_userN");
    var ps = sessionStorage.getItem("_pass");
    var correct;

    if ((localStorage.getItem("_userN") !== null) && (localStorage.getItem("_pass") !== null)) {
        $.ajax({
            async: false,
            method: "POST",
            url: url,
            data: {userName: u, password: p},
            success: function (rsp) {
                correct = true;
                showToast("Welcome back " + u, "", "success", "#36B62D");
            },
            error: function (e) {
                correct = false;
                if (e["responseJSON"] === undefined) {
                    showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
                } else {
                    showToast(e["responseJSON"]["error"], "", "error", "#D43721");
                }
            }
        });
    } else if ((sessionStorage.getItem("_userN") !== null) && (sessionStorage.getItem("_pass") !== null)) {
        $.ajax({
            async: false,
            method: "POST",
            url: url,
            data: {userName: us, password: ps},
            success: function (rsp) {
                correct = true;
                showToast("Welcome back " + us, "", "success", "#36B62D");
            },
            error: function (e) {
                correct = false;
                if (e["responseJSON"] === undefined) {
                    showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
                } else {
                    showToast(e["responseJSON"]["error"], "", "error", "#D43721");
                }
            }
        });
    }
    if (!correct) {
        window.location.replace("./login.html"); //REMOVE COMENTARY FOR WORKING
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

function restart() {
    ended = false;
    rocket.restart();
    stop();
    start();
    doPause();
    updateFuel();
    changeRocketModel();
}

function moveRocket() {
    if (!paused && !ended) {
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
                $("#height").text("70.00");
            }
            //Change img of the rocket
            $("#rocket > img").attr("src", imgRocketBreak[configuration.rocketModel]);
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
    if (!paused && !ended) {
        $(".paused").fadeIn(400);
        $("#btn_playPause > img").attr("src", "img/play.png");
    } else {
        $(".paused").fadeOut(400);
        $("#btn_playPause > img").attr("src", "img/pause.png");
    }
    paused = !paused;
}

function hideContents() {
    $("#set_configuration").hide();
    $("#set_scores").hide();
    $("#set_players").hide();
    $("#set_ranking").hide();
    $("#set_instructions").hide();
    $("#set_about").hide();
}

function loadConfigurations() {
    var url = "GetConfigurationsUser";
    var u = localStorage.getItem("_userN");

    if (u === null) {
        u = sessionStorage.getItem("_userN");
    }

    userName = u;

    $.ajax({
        method: "POST",
        url: url,
        data: {userName: u},
        success: function (jsn) {
            //For each
            $.each(jsn, function (i) {
                var id = jsn[i].id;
                var n = jsn[i].configname;
                var d = jsn[i].diffId;
                var r = jsn[i].rocketId;
                var m = jsn[i].planetId;
                configurations.push(new ConfigurationClass(id, n, d, r, m));
                $('#sel_configurations').append($('<option>', {
                    value: n,
                    text: n + " ---- (" + d + " / " + r + " / " + m + ")"
                }));
            });
        },
        error: function (e) {
            if (e["responseJSON"] === undefined) {
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            } else {
                showToast(e["responseJSON"]["error"], "Error at load configurations", "error", "#D43721");
            }
        }
    });
}

function saveNewConfiguration() {
    var n = $("#inp_confName").val();
    var d = $("#sel_difficulty option:selected").index();
    var r = $("#sel_rocket option:selected").index();
    var m = $("#sel_moon option:selected").index();

    var url = "CreateConfigurationUser";

    $.ajax({
        method: "POST",
        url: url,
        data: {userName: userName, configname: n, diffId: d, rocketId: r, planetId: m},
        success: function (rsp) {
            showToast(rsp["mess"], "", "success", "#36B62D");
            configurations = [];
            $("#sel_configurations").empty();
            loadConfigurations();
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

function loadSelectedConfiguration() {
    var i = $("#sel_configurations option:selected").index();
    configuration.id_conf = configurations[i].id_conf;
    configuration.name = configurations[i].name;
    configuration.difficulty = configurations[i].difficulty;
    configuration.rocketModel = configurations[i].rocketModel;
    configuration.moonModel = configurations[i].moonModel;

    changeDifficulty();
    changeRocketModel();
    changeLunarModel();
}

function deleteSelectedConfiguration() {
    var i = $("#sel_configurations option:selected").index();
    alert(i+" is eliminated");
}

function changeDifficulty() {
    switch (configuration.difficulty) {
        case "1":
            fuelLevel = 50;
            break;
        case "2":
            fuelLevel = 30;
            break;
        case "0":
            fuelLevel = 100;
            break;
    }
}

function checkThereAreConfigurations() {
    if (configurations.length === 0) {
        showToast("Create a new configuration", "It is necesary to play", "warning", "#EC9A06");
        $("#load_configurationContainer").fadeOut(300, function () {
            $("#new_configurationContainer").fadeIn(300);
        });
        return false;
    }
    return true;
}

function changeRocketModel() {
    $("#rocket > img").attr("src", imgRocketOFF[configuration.rocketModel]);
}

function changeLunarModel() {
    $(".d > img").attr("src", imgMoon[configuration.moonModel]);
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