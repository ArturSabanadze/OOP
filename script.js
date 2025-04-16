export class User {
    #id;
    #name;
    #email;
    #username;
    #password;

    constructor(id, name, email, username, password) {
        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#username = username;
        this.#password = password;
    }

    getId() { return this.#id; }
    getName() { return this.#name; }
    getEmail() { return this.#email; }
    getUsername() { return this.#username; }
    getPassword() { return this.#password; }

    setId(newId) { this.#id = newId; }

    toJSON() {
    return {
        id: this.#id,
        name: this.#name,
        email: this.#email,
        username: this.#username
    };
    }
}

class Admin extends User {
    constructor(id, name, email, username, password) {
        super(id, name, email, username, password);
    }

    toJSON() {
        return {
            id: this.getId(),
            name: this.getName(),
            email: this.getEmail(),
            username: this.getUsername(),
            password: this.getPassword()
        };
    }
}

export class AuthManager {
    constructor(database, RegContainerId, LogContainerId) {
        this.database = database;
        this.registerForm = null;
        this.loginForm = null;
        this.RegContainerId = RegContainerId;
        this.LogContainerId = LogContainerId;
    }

    generateRegisterForm() {
        const container = document.getElementById(this.RegContainerId);
        if (!container) return;

        container.innerHTML = `
            <form id="registerForm">
                <input type="text" id="name" name="name" placeholder="Name" required /><br />
                <input type="email" id="email" name="email" placeholder="Email" required /><br />
                <input type="text" id="username" name="username" placeholder="Username" required /><br />
                <input type="password" id="password" name="password" placeholder="Password" required /><br />
                <button type="submit">Register</button>
            </form>
        `;

        this.registerForm = document.getElementById("registerForm");
    }

    generateLoginForm() {
        const container = document.getElementById( this.LogContainerId);
        if (!container) return;

        container.innerHTML = `
            <form id="loginForm">
                <input type="text" id="usernameLogin" name="usernameLogin" placeholder="Username" required /><br />
                <input type="password" id="passwordLogin" name="passwordLogin" placeholder="Password" required /><br />
                <button type="submit">Login</button>
            </form>
        `;

        this.loginForm = document.getElementById("loginForm");
    }

    init() {
        if (this.registerForm) {
            this.registerForm.addEventListener("submit", (e) => this.handleRegister(e));
        }

        if (this.loginForm) {
            this.loginForm.addEventListener("submit", (e) => this.handleLogin(e));
        }
    }

    handleRegister(e) {
        e.preventDefault();
        const form = e.target;

        const newUser = new User(
            this.database.length + 1,
            form.name.value,
            form.email.value,
            form.username.value,
            form.password.value
        );

        const usernameExists = this.database.find(u => u.getUsername() === newUser.getUsername());
        const emailExists = this.database.find(u => u.getEmail() === newUser.getEmail());

        if (usernameExists || emailExists) {
            console.log("User already exists.");
            return;
        }

        this.database.push(newUser);
        console.log("✅ User registered:", newUser.toJSON());
    }

    handleLogin(e) {
        e.preventDefault();
        const form = e.target;

        const username = form.usernameLogin.value;
        const password = form.passwordLogin.value;

        const user = this.database.find(u => u.getUsername() === username && u.getPassword() === password);

        if (user) {
            console.log("✅ Login successful:", user.toJSON());
        } else {
            console.log("❌ Login failed: Invalid credentials");
        }
    }

    formCreator() {
        document.addEventListener("DOMContentLoaded", () => {
            this.generateRegisterForm(); 
            this.generateLoginForm(); 
            this.init(); 
        });
    }
}

export default AuthManager;

