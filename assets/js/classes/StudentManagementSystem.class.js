class StudentManagementSystem {
    constructor() {
        const _users = [
            {
                id: 1,
                username: "admin",
                password: "password",
                acl: ["list", "add", "edit", "delete"]
            },
            {
                id: 2,
                username: "jack",
                password: "jack",
                acl: ["list", "edit"]
            },
            {
                id: 3,
                username: "mathews",
                password: "mathews",
                acl: ["list", "add"]
            }
        ];


        let _students = JSON.parse(localStorage.getItem('students')) || [];
        let _session = JSON.parse(sessionStorage.getItem('session')) || {};

        let _autoIncrementedId = 0;

        const _getUser = (username, password) => {
            for (let i = 0; i < _users.length; i++) {
                const user = _users[i];

                if (user.username == username && user.password == password) {
                    return user;
                }
            }

            return false;
        };

        const _setSession = (key, value) => {
            _session[key] = value;
            sessionStorage.setItem('session', JSON.stringify(_session));
        };

        this.login = (username, password) => {
            if (username && password) {
                if (!this.getSession("user")) {
                    const user = _getUser(username, password);

                    if (user) {
                        _setSession("user", user);
                        return true;
                    } else {
                        return "Invalid username or password";
                    }
                } else {
                    return "User is already loggedin";
                }
            } else {
                return false;
            }
        };

        this.logout = () => {
            _setSession("user", undefined);

            sessionStorage.removeItem("session")

            return true;
        };

        this.addToStudents = (student) => {
            _students.push(student);

            localStorage.setItem('students', JSON.stringify(_students));
        };

        this.setStudents = (students) => {
            _students = [...students];

            localStorage.setItem('students', JSON.stringify(_students));
        };

        this.getSession = (key) => {
            if (key) {
                if (_session.hasOwnProperty(key)) {
                    return _session[key];
                } else {
                    return false;
                }
            } else {
                return { ..._session };
            }
        }

        this.getStudents = () => {
            const loggedInUser = this.getSession("user");
            console.log(loggedInUser);
            if (loggedInUser) {
                if (loggedInUser.acl.indexOf("list") >= 0) {
                    return [..._students];
                }
            }

            return [];
        };

        this.autoIncrementedId = (value) => {
            if (value) { //Set the value
                _autoIncrementedId = value;
            } else {
                return _autoIncrementedId;
            }
        };
    }

    registerStudent(name, age, gender, cls) {
        const students = this.getStudents();
        let id = this.autoIncrementedId() + 1;
        this.autoIncrementedId(id);

        return {
            id,
            name,
            age,
            gender,
            cls
        }
    }

    addStudent(data) {
        const loggedInUser = this.getSession("user");

        if (loggedInUser) {
            if (loggedInUser.acl.indexOf("add") >= 0) {
                const { name, age, gender, cls } = data;
                const student = this.registerStudent(name, age, gender, cls);
                this.addToStudents(student);

                return { status: true, msg: "Student added successfully" };
            } else {
                return { status: false, msg: "You don't have enough permission" };
            }
        } else {
            return { status: false, msg: "Login to continue" };
        }
    }

    getStudentById(studentId) {
        const loggedInUser = this.getSession("user");

        if (loggedInUser) {
            if (loggedInUser.acl.indexOf("list") >= 0) {
                if (studentId) {
                    const students = this.getStudents();

                    for (let i = 0; i < students.length; i++) {
                        const stud = students[i];

                        if (stud.id === parseInt(studentId)) {
                            return { status: true, msg: "", data: stud };
                        }
                    }

                    return { status: false, msg: "Invalid student id" };
                } else {
                    return { status: false, msg: "No student id received to edit" };
                }
            } else {
                return { status: false, msg: "You don't have enough permission" };
            }
        } else {
            return { status: false, msg: "Login to continue" };
        }
    }

    editStudent(studentId, data = {}) {
        const loggedInUser = this.getSession("user");

        if (loggedInUser) {
            if (loggedInUser.acl.indexOf("edit") >= 0) {
                const students = this.getStudents();

                for (let i = 0; i < students.length; i++) {
                    let student = students[i];

                    if (student.id === parseInt(studentId)) {
                        students[i] = { ...student, ...data };

                        this.setStudents([...students]);

                        console.log(this.getStudents());
                        return { status: true, msg: "Student updated successfully" };
                    }
                }

                return { status: false, msg: "Invalid student id" };
            } else {
                return { status: false, msg: "You don't have enough permission" };
            }
        } else {
            return { status: false, msg: "Login to continue" };
        }
    }

    deleteStudent(studentId) {
        const loggedInUser = this.getSession("user");

        if (loggedInUser) {
            if (loggedInUser.acl.indexOf("delete") >= 0) {
                if (studentId) {
                    let students = this.getStudents();

                    if (studentId - 1 <= students.length) {
                        for (let i = 0; i < students.length; i++) {
                            const stud = students[i];

                            if (stud.id === studentId) {
                                students.splice(i, 1);
                                this.setStudents(students);
                                break;
                            }
                        }


                        return { status: true, msg: "Student deleted successfully", data: students };
                    } else {
                        return { status: false, msg: "Student with given id doesn't exist" };
                    }
                } else {
                    return { status: false, msg: "No student id received to edit" };
                }
            } else {
                return { status: false, msg: "You don't have enough permission" };
            }
        } else {
            return { status: false, msg: "Login to continue" };
        }
    }
}
const sms = new StudentManagementSystem();

export { sms };