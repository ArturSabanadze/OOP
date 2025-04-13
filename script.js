
class User {
    #id;
    #name;
    #email;
    #username;
    #passwordHash;

    constructor(id, name, email, username, passwordHash) {
        this.#id = id;
        this.#name = name;
        this.#email = email;
        this.#username = username;
        this.#passwordHash = passwordHash;
    }   

    // Getters
    getId() { return this.#id; }
    getName() { return this.#name; }
    getEmail() { return this.#email; }
    getUsername() { return this.#username; }
    getPassword() { return this.#passwordHash; }

    // Setters
    setId(newId) { this.#id = newId; }
    setName(newName) { this.#name = newName; }
    setEmail(newEmail) { this.#email = newEmail; }
    setUsername(newUsername) { this.#username = newUsername; }
    setPassword(newPassword) { this.#passwordHash = newPassword; }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            email: this.#email,
            username: this.#username,
            passwordHash: this.#passwordHash
        };
    }
}

class AuthManager {

    constructor(database) {
        this.database = database;
    }

    getDatabase() {
        return this.database;
    }

    register(user) {
        const usernameExists = this.database.find(u => u.getUsername() === user.getUsername());
        const emailExists = this.database.find(u => u.getEmail() === user.getEmail());
        const idExists = this.database.some(u => u.getId() === user.getId());

        if (usernameExists || emailExists) {
            throw new Error("User already exists.");
        }
 
        if (idExists) {
            user.setId(this.database.length + 1);
        }

        this.database.push(user);
        return true;
    }

    login(username, password) {
        const user = this.database.find(u => u.getUsername() === username);
        if (!user || user.getPassword() !== password) {
            console.log("User not found or invalid credentials");
        }
    
        return user;
    }
    
}

let DB = [];
const AdminManager = new AuthManager(DB);

//Event listner for Registration form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form behavior

        const id = 1;
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const newUser = new User(id, name, email, username, password);
        
        const success = AdminManager.register(newUser);

        if (success) {
                console.log("User registered:", newUser.toJSON());
                console.log("Database:", AdminManager.getDatabase());
        } else {
                console.log("Registration failed");
        }
    });
});

//Event listner for Login form
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('LoginForm');

    form.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent default form behavior

        const username = document.getElementById('usernameLogin').value;
        const password = document.getElementById('passwordLogin').value;
        
        const login = AdminManager.login(username, password);

        if (login) {
                console.log("Login successfull");
        } else {
                console.log("Login failed");
        }
    });
});
