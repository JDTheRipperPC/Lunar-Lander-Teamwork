/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    //Event Submit for login
    $("#formIn").submit(function () {
        return signInUser();
    });

    //Event Submit for register
    $("#formUp").submit(function () {
        if (checkSamePasswords()) {
            signUpUser();
        }
        return false; //TRUE FOR RECHARGE THE WEB
    });

    //Change to register mode
    $("#log_btnSignUp").click(function () {
        $("#reg_div").fadeIn(700);
        $("#log_div").fadeOut(700);
    });

    //Change to login mode
    $("#reg_btnGoBack").click(function () {
        $("#reg_div").fadeOut(700);
        $("#log_div").fadeIn(700);
    });

    //Event that detects the inputs of the field "repeat password" and checked it
    $("#reg_inpPass2").on('input', function () {
        checkSamePasswords();
    });

    loadStorage();
});


/**
 * Check values passwords creating a Custom Validity message if are different
 * @returns {Boolean}
 */
function checkSamePasswords() {
    var pass1 = $("#reg_inpPass");
    var pass2 = $("#reg_inpPass2");

    if (pass1.val() !== pass2.val()) {
        pass2.focus();
        pass2[0].setCustomValidity("Passwords don't match");
        return false;
    } else {
        pass2[0].setCustomValidity("");
    }
    return true;
}

/**
 * Sign up for the user
 * Name servlet: loginServlet
 * Parameters: userName, password
 * 
 * @returns {undefined} True of all correct
 */
function signInUser() {
    var url = "LoginServlet";
    var u = $("#log_inpUserName").val();
    var p = $("#log_inpPass").val();
    var correct;

    $.ajax({
        async: false,
        method: "POST",
        url: url,
        data: {userName: u, password: p},
        success: function (rsp) {
            correct = true;
            saveStorage(u, p);
            showToast(rsp["mess"], "", "success", "#36B62D");

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
    return correct;
}

/**
 * Sign up for the user
 * Name servlet: createUserServlet
 * Parameters: userName, name, password, email
 * 
 * @returns {undefined}
 */
function signUpUser() {
    var url = "CreateUserServlet";
    var u = $("#reg_inpUserName").val();
    var n = $("#reg_inpName").val();
    var p = $("#reg_inpPass").val();
    var e = $("#reg_inpEmail").val();
    $.ajax({
        method: "POST",
        url: url,
        data: {userName: u, name: n, password: p, email: e},
        success: function (rsp) {
            showToast("Successfull", rsp["mess"], "success", "#36B62D");
        },
        error: function (e) {
            if (e["responseJSON"] === undefined)
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            else
                showToast(e["responseJSON"]["error"], "Is your email correct?", "error", "#D43721");
        }
    });
}

function saveStorage(u, p) {

    //If remember me is cheched --> LocalStorage
    if ($("#chk").prop("checked")) {
        localStorage._userN = u;
        localStorage._pass = p;
    } else {
        // Else.. delete localS and create SessionS
        localStorage.removeItem("_userN");
        localStorage.removeItem("_pass");

        sessionStorage.setItem("_userN", u);
        sessionStorage.setItem("_pass", p);
    }
}

function loadStorage() {
    var u = localStorage._userN;
    var p = localStorage._pass;

    var us = sessionStorage.getItem("_userN");
    var ps = sessionStorage.getItem("_pass");

    if ((localStorage.getItem("_userN") !== null) && (localStorage.getItem("_pass") !== null)) {
        $("#log_inpUserName").val(u);
        $("#log_inpPass").val(p);
        $("#chk").prop("checked", true);
        showToast("Welcome back " + u, "User loaded succesfully", "success", "#36B62D");
    } else if ((sessionStorage.getItem("_userN") !== null) && (sessionStorage.getItem("_pass") !== null)) {
        $("#log_inpUserName").val(us);
        $("#log_inpPass").val(ps);
        showToast("Welcome back " + us, "User loaded succesfully", "success", "#36B62D");
    } else {
        showToast("Welcome to Lunar Lander", "No user data found", "info", "#5868D0");
    }
}

/**
 * The toast is an external librery developed by https://github.com/kamranahmedse/jquery-toast-plugin/
 * Here there are the documentation about how to use it: http://kamranahmed.info/toast
 * @param {type} head Main text message
 * @param {type} text Submessage
 * @param {type} icon (warning | success | error | info)
 * @param {type} bgColor Color of the toast
 * @returns {undefined}
 */
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