/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */


$(document).ready(function () {
    $("#btnSignIn").click(function () {
        if (checkSignInFields()) {
            signInUser();
        }
    });

    $("#btnSignUp").click(function () {
        if (checkSignUpFields()) {
            signUpUser();
        }
    });
});

function checkSignInFields() {
    if ($("#inpUserName").val() === "") {
        alert("Insert a UserName");
        $("#inpUserName").focus();
        return false;
    }

    if ($("#inpPass").val() === "") {
        alert("Insert a Password");
        $("#inpPass").focus();
        return false;
    }
    return true;
}

function checkSignUpFields() {
    if ($("#inpUserName").val() === "") {
        alert("Insert a UserName");
        $("#inpUserName").focus();
        return false;
    }

    if ($("#inpPass").val() === "") {
        alert("Insert a Password");
        $("#inpPass").focus();
        return false;
    }
    if ($("#inpName").val() === "") {
        alert("Insert a Name");
        $("#inpName").focus();
        return false;
    }

    if ($("#inpEmail").val() === "") {
        alert("Insert a Email");
        $("#inpEmail").focus();
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
    var u = $("#inpUserName").val();
    var p = $("#inpPass").val();
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
    var u = $("#inpUserName").val();
    var n = $("#inpName").val();
    var p = $("#inpPass").val();
    var e = $("#inpEmail").val();
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