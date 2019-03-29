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
    const $studentsPanelRef = $("#students-pannel");
    const $studentFormRef = $("#student-form",$studentsPanelRef);

    $loginFormRef.on("submit", e => {
        e.preventDefault();

        // Fetch the values form the input
        const username = $("#username", $loginFormRef).val();
        const password = $("#password", $loginFormRef).val();
        
        // Login the user with given inputs
        const response = sms.login(username, password);

        if (response == true) { // Successful Login
            $(".alert", $loginPannelRef).text("Loggedin Successfully").addClass("alert-success").removeClass("alert-danger d-none");
            $loginPannelRef.addClass("d-none");
            $studentsPanelRef.removeClass("d-none");
        } else {
            $(".alert", $loginPannelRef).text(response).addClass("alert-danger").removeClass("alert-success d-none");
        }
    });

    $("#logout-btn",$studentsPanelRef).on("click",()=>{
        if(sms.logout()){            
            $studentsPanelRef.addClass("d-none");
            $loginPannelRef.removeClass("d-none");

            $(".alert", $loginPannelRef).text("Loggedout Successfully").addClass("alert-success").removeClass("alert-danger d-none");
        }
    });


    const _repaintStudents = () => {
        const students = sms.getStudents();

        let studentsHtml = '';
        for (let i = 0; i < students.length; i++) {
            const student = students[i];

            studentsHtml += `<tr><td>${student.id}</td><td>${student.name}</td><td>${student.age}</td><td>${student.gender}</td><td>${student.cls}</td><td class="d-flex justify-content-around"><button class="btn btn-primary edit-btn" data-sid="${student.id}">Edit</button><button class="btn btn-danger delete-btn" data-sid="${student.id}" data-toggle="modal" data-target="#delete-confirmation-modal">Delete</button></td></tr>`;
        }


        $("table tbody", $studentsPanelRef).html(studentsHtml);
    };
    
    $studentFormRef.on("submit", e => {
        e.preventDefault();

        const name = $("#name", $studentFormRef).val();
        const age = $("#age", $studentFormRef).val();
        const gender = $("#gender", $studentFormRef).val();
        const cls = $("#class", $studentFormRef).val();

        let response;

        response = sms.addStudent({ name, age, gender, cls });
        
        console.log(response);

        if (response) {
            const $alertRef = $("#students-form-area .alert", $studentsPanelRef);
            if (response.status) {
                $alertRef.addClass("alert-success");

                // Show the table
                $("table", $studentsPanelRef).removeClass("d-none");

                // Hide no result msg
                $(".no-students", $studentsPanelRef).addClass("d-none");
            } else {
                $alertRef.addClass("alert-danger");
            }

            $alertRef.text(response.msg).removeClass("d-none");

            setTimeout(() => {
                $alertRef.text("").addClass("d-none").removeClass("alert-success alert-danger");
            }, 3000);
        }

        //Re-create the table
        _repaintStudents();

        // Reset the form
        e.currentTarget.reset();

        // Reset the focus on form
        $("#name", $studentFormRef).focus();
    });
});