/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    $("#log_btnSignIn").click(function () {
        if (checkSignInFields()) {
            signInUser();
        }
    });

    $("#log_btnSignUp").click(function () {
        $("#reg_div").fadeIn(700);
        $("#log_div").fadeOut(700);
    });

    $("#reg_btnSignUp").click(function () {
        if (checkSignUpFields()) {
            signUpUser();
        }
    });

    $("#reg_btnGoBack").click(function () {
        $("#reg_div").fadeOut(700);
        $("#log_div").fadeIn(700);
    });
});

/**
 * Check values of the sign Up fields before send any information
 * @returns {Boolean}
 */
function checkSignInFields() {
    if ($("#log_inpUserName").val() === "") {
        alert("Insert a UserName");
        $("#log_inpUserName").focus();
        return false;
    }

    if ($("#log_inpPass").val() === "") {
        alert("Insert a Password");
        $("#log_inpPass").focus();
        return false;
    }
    return true;
}

/**
 * Check values of the sign Up fields before send any information
 * @returns {Boolean}
 */
function checkSignUpFields() {
    if ($("#reg_inpUserName").val() === "") {
        alert("Insert a UserName");
        $("#reg_inpUserName").focus();
        return false;
    }

    if ($("#reg_inpPass").val() === "") {
        alert("Insert a Password");
        $("#reg_inpPass").focus();
        return false;
    }

    if ($("#reg_inpPass2").val() === "") {
        alert("Repeat your password");
        $("#reg_inpPass2").focus();
        return false;
    }

    if ($("#reg_inpName").val() === "") {
        alert("Insert a Name");
        $("#reg_inpName").focus();
        return false;
    }

    if ($("#reg_inpEmail").val() === "") {
        alert("Insert an Email");
        $("#reg_inpEmail").focus();
        return false;
    }
    return true;
}

/**
 * Sign up for the user
 * Name servlet: loginServlet
 * Parameters: userName, password
 * 
 * @returns {undefined}
 */
function signInUser() {
    var url = "loginServlet";
    var u = $("#log_inpUserName").val();
    var p = $("#log_inpPass").val();
    alert(u+p);
    $.ajax({
        method: "POST",
        url: url,
        data: {userName: u, password: p},
        success: function (rsp) {
            alert(rsp["mess"]);
            location.reload();
        },
        error: function (e) {
            if (e["responseJSON"] === undefined)
                alert("emess");
            else
                alert(e["responseJSON"]["error"]);
        }
    });
}

/**
 * Sign up for the user
 * Name servlet: createUserServlet
 * Parameters: userName, name, password, email
 * 
 * @returns {undefined}
 */
function signUpUser() {
    var url = "createUserServlet";
    var u = $("#reg_inpUserName").val();
    var n = $("#reg_inpName").val();
    var p = $("#reg_inpPass").val();
    var e = $("#reg_inpEmail").val();
    $.ajax({
        method: "POST",
        url: url,
        data: {userName: u, name: n, password: p, email: e},
        success: function (rsp) {
            alert(rsp["mess"]);
        },
        error: function (e) {
            if (e["responseJSON"] === undefined)
                alert("emess");
            else
                alert(e["responseJSON"]["error"]);
        }
    });
}
