// User.ts
// Class Implementation
export default class User {
    constructor(names, username, email, password, createdAt = new Date(), id) {
        this.names = names;
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.id = id;
    }
}
