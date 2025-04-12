class User {
    constructor(name, email, password) {
        this.name = name;
        this.email = email;
        this.password = password;
    }

    getName() {
        return this.name;
    }

    gettEmail() {
        return this.email;
    }

    getPassword() {
        return this.password;
    }

    setName(newName) {
        this.name = newName;
    }

    setEmail(newEmail) {
        this.email = newEmail;
    }

    setPassword(newPassword) {
        this.password = newPassword;
    }
}

let user1 = new User("artur", "diakosmisi26@hotmail.com", 1234);
user1.setName("Peter");

console.log(user1.getName());