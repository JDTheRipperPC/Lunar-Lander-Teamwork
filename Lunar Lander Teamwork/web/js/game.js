/*VARIABLES*/

//GAME
var gravity = 1.622;
var dt = 0.016683;
var timer = null;
var timerFuel = null;
var timerBG = null;
var paused = true;
var ended = false;
var heightGame = 70;
var maxSpeedImpact = 5;
var imgRocketOFF = ["img/rocket1OFF.png", "img/rocket2OFF.png"];
var imgRocketON = ["img/rocket1ON.png", "img/rocket2ON.png"];
var imgRocketBreak = ["img/rocket1Break.gif", "img/rocket2Break.gif"];
var imgMoon = ["img/moon1.png", "img/moon2.png", "img/moon3.png"];
var imgSpace = ["img/space1.jpg", "img/space2.jpg", "img/space3.jpg", "img/space4.jpg"];
var configurations = [];
var maxFuelLevel = 100;
var userName;
var actualScoreId;
var someModalOpened = true;

//ROCKET
var rocket = {
    height: 10,
    speed: 0,
    fuel: maxFuelLevel,
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
        this.aceleration = gravity;
        this.fuel = maxFuelLevel;
    }
};

//CONFIGURATION 
function ConfigurationClass(id_conf, name, diff, rocket, moon) {
    this.id_conf = id_conf;
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

/*--------------- END OF VARIABLES ---------------*/

/*--------------- METHODS ---------------*/

//DOCUMENT READY
$(document).ready(function () {

    //CHECK LOCAL STORAGE FOR CHEATERS
    checkStorage();
    loadChangingBackground();
    loadConfigurations();

    //EVENTS RELATED WITH THE MODAL:
    //START CLICKS NAV -> It changes the active item of the nave
    $('.nav li').click(function (e) {
        $('.nav li.active').removeClass('active');
        var $this = $(this);
        if (!$this.hasClass('active')) {
            $this.addClass('active');
        }
        e.preventDefault();
        hideContents(); //Hide the contents div of the items for the new selected
    });

    $("#nav_configuration").click(function () {
        $("#set_configuration").show();
    });
    $("#nav_scores").click(function () {
        loadScores();
        $("#set_scores").show();
    });
    $("#nav_players").click(function () {
        loadPlayersOnline();
        $("#set_players").show();
    });
    $("#nav_ranking").click(function () {
        loadRanking();
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
            someModalOpened = false;
            restart();
        }
    });

    //Event for delete a configuration
    $("#btn_deleteC").click(function () {
        if ($("#sel_configurations option:selected").index() !== -1) {
            $("#modal_delete").modal("show");
            someModalOpened = true;
        } else {
            showToast("No configuration detected", "Create one", "info", "#5868D0");
        }
    });

    $("#btn_acceptDelete").click(function () {
        deleteSelectedConfiguration();
        $("#modal_delete").modal("hide");
    });
    $("#btn_cancelDelete").click(function () {
        $("#modal_delete").modal("hide");
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
            someModalOpened = false;
            restart();
        }
    });

    //Modal of exit
    $("#btn_acceptExit").click(function () {
        window.location.replace("./login.html");
    });

    $("#btn_cancelExit").click(function () {
        someModalOpened = false;
    });

    //END OF CLICKS NAV-------------------

    //OTHER BUTTONS EVENTS
    $("#btn_playPause").click(function () {
        doPause();
    });

    $("#btn_restart").click(function () {
        restart();
    });

    $("#btn_settings").click(function () {
        $("#modal_Settings").modal("show");
        someModalOpened = true;
    });

    $("#btn_logout").click(function () {
        $("#modal_Exit").modal("show");
        someModalOpened = true;
    });

    $("#btn_PlayAgain").click(function () {
        restart();
        someModalOpened = false;
    });

    $("#modal_Settings").modal("show");

    /*--------- EVENTS TO PLAY THE GAME ---------*/
    //ON/OFF motor on screen click
    /*$(document).click(function () {
     if (rocket.aceleration === gravity) {
     rocket.motorON();
     } else {
     rocket.motorOFF();
     }
     });
     */
    document.body.addEventListener("touchstart", motorOn(), false);
    document.body.addEventListener("touchend", motorOff(), false);

    //ON/OFF motor on key click
    $(document).keydown(function (e) {
        checkKeyPressed(e);
    });
    $(document).keyup(function () {
        rocket.motorOFF();
    });

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
    //The  game starts, and we will start to create the score
    initScore();
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
    loadChangingBackground();
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
            $("#rocket")[0].style.top = rocket.height + "%";
        } else {
            //Game ended, save the score
            doPause();
            ended = true;
            stop();
            //Fast check if is in the top or bottom side

            //If it hits in the ground.. check the speed
            if (rocket.height > 65) {
                $("#height").text("0.00");
                //See the impact speed
                if (rocket.speed < maxSpeedImpact) {
                    finishScore();
                    showModalEnd("WELL DONE!", "You are amazing, good job!", calculateScore(rocket.fuel, rocket.speed, configuration.difficulty));

                } else {
                    showModalEnd("MISSION FAILED", "Ohh, it hurts! Remember that the maximum impact speed is 5m/s!", 0);
                    //Change img of the rocket
                    $("#rocket > img").attr("src", imgRocketBreak[configuration.rocketModel]);
                }
            } else {
                showModalEnd("MISSION FAILED", "Whoops.. Are you trying to get out of the screen?", 0);
                $("#height").text("70.00");
                //Change img of the rocket
                $("#rocket > img").attr("src", imgRocketBreak[configuration.rocketModel]);
            }
        }
    }
}

function motorOn() {
    if (rocket.haveFuel() && (!paused) && (!ended)) {
        $("#rocket > img").attr("src", imgRocketON[configuration.rocketModel]);
        rocket.aceleration = -gravity;
        if (timerFuel === null)
            timerFuel = setInterval(function () {
                rocket.updateFuel();
            }, 10);
    }
}
function motorOff() {
    if ((!paused) && (!ended)) {
        $("#rocket > img").attr("src", imgRocketOFF[configuration.rocketModel]);
        rocket.aceleration = gravity;
        clearInterval(timerFuel);
        timerFuel = null;
    }
}

function updateFuel() {
    if (rocket.haveFuel() && (!paused) && (!ended)) {
        //Decrement fuel until its 0
        rocket.fuel -= 0.1;
        if (!rocket.haveFuel()) {
            rocket.fuel = 0;
            rocket.motorOFF();
        }
        $("#fuelContent")[0].style.top = (100 - rocket.fuel) + "%";
    }
}

function doPause() {
    if (!paused && !ended) {
        //Visual fadeIn on cascade
        $("#btn_restart").fadeIn(100);
        $("#btn_settings").fadeIn(400);
        $("#btn_logout").fadeIn(800);
        $("#btn_playPause > img").attr("src", "img/play.png");
        $("#divGamePaused").fadeIn(300);
    } else {
        //Visual fadeOut on cascade
        $("#btn_restart").fadeOut(800);
        $("#btn_settings").fadeOut(400);
        $("#btn_logout").fadeOut(100);
        $("#btn_playPause > img").attr("src", "img/pause.png");
        $("#divGamePaused").fadeOut(300);
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

function loadRanking() {
    var url = "GetTopRanking";

    $.ajax({
        method: "GET",
        url: url,
        data: {},
        success: function (jsn) {
            //Clear the table:
            $("#table_ranking > tbody").empty();
            //Put the rankings
            $.each(jsn, function (i, item) {
                var clas;
                var name = item[0];
                var games = item[1];
                switch (i) {
                    case 0:
                        clas = "success";
                        break;
                    case 1:
                        clas = "info";
                        break;
                    case 2:
                        clas = "danger";
                        break;
                    default:
                        clas = "default";

                }
                var row = "<tr class=" + clas + "><td>" + (i + 1) + "</td><td>" + name + "</td><td>" + (games) + "</td></tr>";
                $("#table_ranking > tbody").append(row);
            });
        },
        error: function (e) {
            if (e["responseJSON"] === undefined) {
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            } else {
                showToast(e["responseJSON"]["error"], "Whoops, some error ocurred", "error", "#D43721");
            }
        }
    });
}

function loadPlayersOnline() {
    var url = "UsersOnline";
    $.ajax({
        method: "GET",
        url: url,
        data: {},
        success: function (jsn) {
            //Clear the table:
            $("#table_players > tbody").empty();
            //Put the rankings
            $.each(jsn, function (i, item) {
                var name = item.username;
                var row = "<tr><td>" + name + "</td><td><span>Online</span></td></tr>";
                $("#table_players > tbody").append(row);
            });
        },
        error: function (e) {
            if (e["responseJSON"] === undefined) {
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            } else {
                showToast(e["responseJSON"]["error"], "Whoops, some error ocurred", "error", "#D43721");
            }
        }
    });
}

function loadScores() {
    var url = "GetScoresUser";
    $.ajax({
        method: "POST",
        url: url,
        data: {userName: userName},
        success: function (jsn) {
            //Clear the table:
            $("#table_scores > tbody").empty();
            //Put the scores
            $.each(jsn, function (i, item) {
                var name = item.confId.configname;
                var d = item.confId.diffId;
                var dif;
                switch (d) {
                    case 0:
                        dif = "Easy";
                        break;
                    case 1:
                        dif = "Medium";
                        break;
                    case 2:
                        dif = "Hard";
                        break;
                }
                var speed = (item.speed).toFixed(2);
                var fuel = (item.fuel).toFixed(2);
                var score = calculateScore(fuel, speed, d);
                var row = "<tr><td>" + (i + 1) + "</td><td>" + name + "</td><td>" + dif + "</td><td>" + fuel + "</td><td>" + speed + "</td><td>" + score + "</td></tr>";
                $("#table_scores > tbody").append(row);
            });
        },
        error: function (e) {
            if (e["responseJSON"] === undefined) {
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            } else {
                showToast(e["responseJSON"]["error"], "The score will be not saved", "error", "#D43721");
            }
        }
    });
}

function initScore() {
    var configurationId = configuration.id_conf;
    var url = "CreateScoreUser";

    $.ajax({
        method: "POST",
        url: url,
        data: {configurationId: configurationId},
        success: function (rsp) {
            actualScoreId = rsp.scoreId;
        },
        error: function (e) {
            if (e["responseJSON"] === undefined) {
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            } else {
                showToast(e["responseJSON"]["error"], "The score will be not saved", "error", "#D43721");
            }
        }
    });
}

function finishScore() {
    var scoreId = actualScoreId;
    var fuel = rocket.fuel;
    var speed = rocket.speed;
    var url = "SetScoreUser";

    $.ajax({
        method: "POST",
        url: url,
        data: {scoreId: scoreId, fuel: fuel, speed: speed},
        success: function (rsp) {
            showToast(rsp["mess"], "Saved correctly", "success", "#36B62D");
        },
        error: function (e) {
            if (e["responseJSON"] === undefined) {
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            } else {
                showToast(e["responseJSON"]["error"], "The score will be not saved", "error", "#D43721");
            }
        }
    });
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
                    text: parseSelectConfigName(n, d, r, m)
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
            //And clear the field name of the config
            $("#inp_confName").val("");
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
    var idToDelete = configurations[i].id_conf;
    var nameToDelete = configurations[i].name;
    var url = "DestroyConfigurationUser";

    $.ajax({
        method: "POST",
        url: url,
        data: {configurationId: idToDelete},
        success: function (rsp) {
            showToast(rsp["mess"], "", "success", "#36B62D");
            $("#sel_configurations option[value='" + nameToDelete + "']").remove();
            configurations.splice(i, 1);
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

function changeDifficulty() {
    switch (configuration.difficulty) {
        case 1:
            maxFuelLevel = 60;
            break;
        case 2:
            maxFuelLevel = 40;
            break;
        case 0:
            maxFuelLevel = 100;
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

function calculateScore(fuel, speed, dif) {
    return ((10 - speed) * (100 - maxFuelLevel + fuel) * (dif + 1)).toFixed(2);
}

function checkKeyPressed(event) {
    if (!someModalOpened) {
        var key = event.which || event.keyCode;
        switch (key) {
            case 82: //R --> RESTART 
                restart();
                break;
            case 80: //P --> PAUSE / PLAY
                doPause();
                break;
            case 32: //SPACE --> motorOn
                rocket.motorON();
                break;
        }
    }
}

function showModalEnd(title, body, score) {
    $("#modal_End h3").text(title);
    $("#gameFinishedConent").text(body);
    $("#modal_End span").text(score);
    $("#modal_End").modal("show");
    someModalOpened = true;
}

function changeRocketModel() {
    $("#rocket > img").attr("src", imgRocketOFF[configuration.rocketModel]);
}

function changeLunarModel() {
    //StarWars rocket, have a distinct bot, so the ground will be changed for a nice aspect in the game
    if (configuration.rocketModel === 1) {
        $(".d")[0].style.height = 14.5 + "%";
    } else {
        $(".d")[0].style.height = 10.5 + "%";
    }
    $(".d > img").attr("src", imgMoon[configuration.moonModel]);
}

function loadChangingBackground() {
    var i = new Date().getMinutes() % imgSpace.length;
    $('body').css("background-image", "url(" + imgSpace[i] + "");
}

/**
 * Parse the number information to a String text
 * @param {type} n Name of the configuration
 * @param {type} d Difficulty
 * @param {type} r Rocket model
 * @param {type} m Moon Model
 * @returns {undefined} String with the text
 */
function parseSelectConfigName(n, d, r, m) {
    switch (d) {
        case 0:
            d = "Easy";
            break;
        case 1:
            d = "Medium";
            break;
        case 2:
            d = "Hard";
            break;
    }
    switch (r) {
        case 0:
            r = "Standar";
            break;
        case 1:
            r = "StarWars";
            break;
    }
    switch (m) {
        case 0:
            m = "Fire";
            break;
        case 1:
            m = "Water";
            break;
        case 2:
            m = "Earth";
            break;
    }
    return (n + " ---- (" + d + " / " + r + " / " + m + ")");
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