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
    var userName = $("#log_inpUserName");
    var pass = $("#log_inpPass");

    if (userName.val() === "") {
        showToast("INSERT A USERNAME", "Complete the field", "warning", "#D86405");
        userName.focus();
        return false;
    }
    if (userName.val().length < 4) {
        showToast("INSERT A USERNAME", "Minimum 4 characters", "warning", "#D86405");
        userName.focus();
        return false;
    }
    if (pass.val() === "") {
        showToast("INSERT A PASSWORD", "Complete the field", "warning", "#D86405");
        pass.focus();
        return false;
    }
    if (pass.val().length < 4) {
        showToast("INSERT A PASSWORD", "Minumum 4 characters", "warning", "#D86405");
        pass.focus();
        return false;
    }
    return true;
}

/**
 * Check values of the sign Up fields before send any information
 * @returns {Boolean}
 */
function checkSignUpFields() {
    var userName = $("#reg_inpUserName");
    var pass1 = $("#reg_inpPass");
    var pass2 = $("#reg_inpPass2");
    var name = $("#reg_inpName");
    var email = $("#reg_inpEmail");

    if (userName.val() === "") {
        showToast("INSERT A USERNAME", "Complete the field", "warning", "#D86405");
        userName.focus();
        return false;
    }
    if (userName.val().length < 4) {
        showToast("INSERT A USERNAME", "Minimum 4 characters", "warning", "#D86405");
        userName.focus();
        return false;
    }
    if (pass1.val() === "") {
        showToast("INSERT A PASSWORD", "Complete the field", "warning", "#D86405");
        pass1.focus();
        return false;
    }
    if (pass1.val().length < 4) {
        showToast("INSERT A PASSWORD", "Minimum 4 characters", "warning", "#D86405");
        pass1.focus();
        return false;
    }
    if (pass2.val() === "") {
        showToast("REPEAT PASSWORD", "Complete the field", "warning", "#D86405");
        pass2.focus();
        return false;
    }
    if (pass1.val() !== pass2.val()) {
        showToast("PASSWORDS ARE DIFFERENT", "Write the same password", "warning", "#D86405");
        pass2.focus();
        return false;
    }
    if (name.val() === "") {
        showToast("INSERT A NAME", "Complete the field", "warning", "#D86405");
        name.focus();
        return false;
    }
    if (name.val().length < 3) {
        showToast("INSERT A NAME", "Minimum 3 characters", "warning", "#D86405");
        name.focus();
        return false;
    }
    if (email.val() === "") {
        showToast("INSERT A VALID E-MAIL", "Complete the field", "warning", "#D86405");
        email.focus();
        return false;
    }
    if (!(email.val().includes("@") && (email.val().includes(".com") || email.val().includes(".es")))) {
        showToast("INSERT A VALID E-MAIL", "Check: @ / .com / .es", "warning", "#D86405");
        email.focus();
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
    $.ajax({
        method: "POST",
        url: url,
        data: {userName: u, password: p},
        success: function (rsp) {
            alert(rsp["mess"]);
            showToastSuccess(rsp["mess"], "");
            location.reload();
        },
        error: function (e) {
            if (e["responseJSON"] === undefined) {
                //alert("Unknown error");
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            } else {
                //alert(e["responseJSON"]["error"]);
                showToast(e["responseJSON"]["error"], "error", "#D43721");
            }
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
            //alert(rsp["mess"]);
            showToastSuccess(rsp["mess"], "");
        },
        error: function (e) {
            if (e["responseJSON"] === undefined)
                showToast("UNKNOWN ERROR", "Try it later", "error", "#D43721");
            else
                showToast(e["responseJSON"]["error"], "Try it later", "error", "#D43721");
        }
    });
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