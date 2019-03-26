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
    }
}
const sms = new StudentManagementSystem();

export { sms };