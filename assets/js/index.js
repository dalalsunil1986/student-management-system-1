// jquery is required for bootstrap
import $ from 'jquery'

// bootstrap
import 'bootstrap'

// bootstrap css 
import 'bootstrap/dist/css/bootstrap.css'

import "../sass/index.scss";

import { sms } from "./classes/StudentManagementSystem.class";

$(document).ready(() => {
    const $loginPannelRef = $("#login-pannel");
    const $loginFormRef = $("#login-form", $loginPannelRef);
    const $studentsPanelRef = $("#students-pannel");
    const $studentFormRef = $("#student-form", $studentsPanelRef);
    const $studentsTableAreaRef = $("#students-table-area", $studentsPanelRef);

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

            // Check already have previously saved users or not
            let students = localStorage.getItem("students");
            if (students) {
                students = JSON.parse(students);
                _repaintStudents();

                if (students.length > 0) {
                    // Show the table
                    $("table", $studentsPanelRef).removeClass("d-none");

                    // Hide no result msg
                    $(".no-students", $studentsPanelRef).addClass("d-none");
                }
            }
        } else {
            $(".alert", $loginPannelRef).text(response).addClass("alert-danger").removeClass("alert-success d-none");
        }
    });

    $("#logout-btn", $studentsPanelRef).on("click", () => {
        if (sms.logout()) {
            $studentsPanelRef.addClass("d-none");
            $loginPannelRef.removeClass("d-none");

            $(".alert", $loginPannelRef).text("Loggedout Successfully").addClass("alert-success").removeClass("alert-danger d-none");
        }
    });


    const _repaintStudents = () => {
        const students = sms.getStudents();

        let studentsHtml = '';
        if (students) {
            for (let i = 0; i < students.length; i++) {
                const student = students[i];

                studentsHtml += `<tr><td>${student.id}</td><td>${student.name}</td><td>${student.age}</td><td>${student.gender}</td><td>${student.cls}</td><td class="d-flex justify-content-around"><button class="btn btn-primary edit-btn" data-sid="${student.id}">Edit</button><button class="btn btn-danger delete-btn" data-sid="${student.id}" data-toggle="modal" data-target="#delete-confirmation-modal">Delete</button></td></tr>`;
            }
        }


        $("table tbody", $studentsPanelRef).html(studentsHtml);
    };

    $studentFormRef.on("submit", e => {
        e.preventDefault();

        const name = $("#name", $studentFormRef).val();
        const age = $("#age", $studentFormRef).val();
        const gender = $("#gender", $studentFormRef).val();
        const cls = $("#class", $studentFormRef).val();
        const mode = $("#mode", $studentFormRef).val();

        let response;

        if (mode === "add") {
            response = sms.addStudent({ name, age, gender, cls });
        } else if (mode === "edit") {
            const studentId = $("#id", $studentFormRef).val();
            response = sms.editStudent(studentId, { name, age, gender, cls });

            /*Reset form for Add Student*/
            //Reset form values
            $("#id", $studentFormRef).val("");
            $("#mode", $studentFormRef).val("add");

            //Reset Form title
            $(".form-title", $studentsPanelRef).text("Add Student");

            //Reset button text
            $("button", $studentFormRef).text("Add Student");
        }

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


    const _handleStudentEditEvent = e => {
        const $elemRef = $(e.currentTarget);

        //Retrieve the student id
        const sId = $elemRef.data("sid");

        // Fetch the student data from the DB
        let studentData = sms.getStudentById(sId);
        studentData = studentData.data;
        console.log(studentData);

        // Populate the data in the from
        //Set form values
        $("#name", $studentFormRef).val(studentData.name);
        $("#age", $studentFormRef).val(studentData.age);
        $("#gender", $studentFormRef).val(studentData.gender);
        $("#class", $studentFormRef).val(studentData.cls);
        $("#id", $studentFormRef).val(studentData.id);
        $("#mode", $studentFormRef).val("edit");


        //Set Form title
        $(".form-title", $studentsPanelRef).text("Edit Student");

        $("button", $studentFormRef).text("Update");
    };
    $studentsTableAreaRef.on('click', ".edit-btn", _handleStudentEditEvent);

    const _handleStudentDelete = e => {
        const studentId = $(e.currentTarget).data("sid");

        // Bind delete functionality on delete button of modal
        $('#delete-confirmation-modal').on('shown.bs.modal', function (e) {
            const $modalRef = $(this);

            $(".delete-stud-btn", $modalRef).off("click").on("click", () => {
                console.log(studentId);
                const response = sms.deleteStudent(studentId);



                if (response.status) {
                    $("#students-table-area .alert", $studentsPanelRef).text(response.msg).addClass("alert-success").removeClass("d-none");

                    setTimeout(() => {
                        $("#students-table-area .alert", $studentsPanelRef).text("").addClass("d-none").removeClass("alert-success alert-danger");
                    }, 3000);

                    $('#delete-confirmation-modal').modal('hide');
                    _repaintStudents();

                    if (response.data.length === 0) {
                        // Show the table
                        $("table", $studentsPanelRef).addClass("d-none");

                        // Hide no result msg
                        $(".no-students", $studentsPanelRef).removeClass("d-none");
                    }
                } else {
                    $("#students-table-area .alert", $studentsPanelRef).text(response.msg).addClass("alert-danger").removeClass("d-none");

                    setTimeout(() => {
                        $("#students-table-area .alert", $studentsPanelRef).text("").addClass("d-none").removeClass("alert-success alert-danger");
                    }, 3000);

                    $('#delete-confirmation-modal').modal('hide');
                }
            });
        });
    };

    $studentsPanelRef.on("click", ".delete-btn", _handleStudentDelete);





    //Check already loggedin or not
    if (sessionStorage.getItem("session")) {
        $loginPannelRef.addClass("d-none");
        $studentsPanelRef.removeClass("d-none");
        $(".alert", $loginPannelRef).text("").addClass("d-none");

        // Check already have previously saved users or not
        let students = localStorage.getItem("students");
        if (students) {
            students = JSON.parse(students);
            _repaintStudents();

            if (students.length > 0) {
                // Show the table
                $("table", $studentsPanelRef).removeClass("d-none");

                // Hide no result msg
                $(".no-students", $studentsPanelRef).addClass("d-none");
            }
        }
    } else {
        $loginPannelRef.removeClass("d-none");
        $studentsPanelRef.addClass("d-none");
        $(".alert", $loginPannelRef).text("").addClass("d-none");
    }


});