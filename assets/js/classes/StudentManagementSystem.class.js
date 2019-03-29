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
        let _students = [];
        let _session = {};
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
            return true;
        };

        this.addToStudents = (student) => {
            _students.push(student);
        };

        this.setStudents = (students) => {
            _students = [...students];
            sessionStorage.setItem('students', JSON.stringify(_students));
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

            if (loggedInUser) {
                if (loggedInUser.acl.indexOf("list") >= 0) {
                    return [..._students];
                }
            }
        };

        this.autoIncrementedId = (value)=>{
            if(value){ //Set the value
                _autoIncrementedId = value;
            } else {
                return _autoIncrementedId;
            }
        };
    }

    registerStudent(name, age, gender, cls) {
        const students = this.getStudents();
        let id = this.autoIncrementedId()+1;
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
}
const sms = new StudentManagementSystem();

export { sms };