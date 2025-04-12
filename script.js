import bcrypt from 'bcryptjs';

// User class with getters and setters.
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
    
    // ✅ Renamed to better reflect intent
    getPasswordHash() { return this.#passwordHash; }

    // Setters
    setId(newId) { this.#id = newId; }
    setName(newName) { this.#name = newName; }
    setEmail(newEmail) { this.#email = newEmail; }
    setUsername(newUsername) { this.#username = newUsername; }

    // ✅ Hashing password using bcrypt
    async setPassword(newPassword) {
        this.#passwordHash = await AuthManager.hashPassword(newPassword);
    }

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
    #database;

    constructor(database) {
        this.#database = database;
    }

    // Static method to hash passwords
    static async hashPassword(password) {
        const saltRounds = 10;
        return await bcrypt.hash(password, saltRounds);
    }

    // Register user
    async register(user) {
        const usernameExists = this.#database.find(u => u.getUsername() === user.getUsername());
        const emailExists = this.#database.find(u => u.getEmail() === user.getEmail());

        if (usernameExists) {
            console.log("Username already exists.");
            return false;
        }

        if (emailExists) {
            throw new Error("Email already exists.");
        }

        // Optional: Resolve duplicate ID
        const idExists = this.#database.some(u => u.getId() === user.getId());
        if (idExists) {
            user.setId(this.#database.length + 1);
        }

        this.#database.push(user);
        return true;
    }

    // Login
    async login(username, password) {
        const user = this.#database.find(u => u.getUsername() === username);
        if (!user) {
            throw new Error("User not found.");
        }

        const isPasswordValid = await bcrypt.compare(password, user.getPasswordHash()); // ✅ Fixed method name
        if (!isPasswordValid) {
            throw new Error("Invalid password.");
        }

        return user;
    }
}

class AuthConstructor {
    constructor(userInstance) {
        this.users = [];
        this.authManager = new AuthManager(this.users);
    }

    async registerUser(user) {
        return await this.authManager.register(user);
    }

    async loginUser(username, password) {
        return await this.authManager.login(username, password);
    }
}

