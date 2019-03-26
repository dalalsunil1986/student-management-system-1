// jquery is required for bootstrap
import $ from 'jquery'

// bootstrap
import 'bootstrap'

// bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'

import "../sass/index.scss";

import {sms} from "./classes/StudentManagementSystem.class";

$(document).ready(() => {
    const $loginPannelRef = $("#login-pannel");
    const $loginFormRef = $("#login-form", $loginPannelRef);

    $loginFormRef.on("submit", e => {
        e.preventDefault();

        // Fetch the values form the input
        const username = $("#username", $loginFormRef).val();
        const password = $("#password", $loginFormRef).val();
        
        // Login the user with given inputs
        const response = sms.login(username, password);

        if (response == true) { // Successful Login
            $(".alert", $loginPannelRef).text("Loggedin Successfully").addClass("alert-success").removeClass("alert-danger d-none");
        } else {
            $(".alert", $loginPannelRef).text(response).addClass("alert-danger").removeClass("alert-success d-none");
        }
    });

    $("#logout-btn",$loginPannelRef).on("click",()=>{
        if(sms.logout()){
            $(".alert", $loginPannelRef).text("Loggedout Successfully").addClass("alert-success").removeClass("alert-danger d-none");
        }
    });
});