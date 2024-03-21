import bcrypt from 'bcryptjs';
export default class User {
    constructor(names, username, email, password, createdAt = new Date(), id) {
        this.names = names;
        this.username = username;
        this.email = email;
        this.password = password;
        this.createdAt = createdAt;
        this.id = id;
    }
    async hashPassword() {
        const saltRounds = 10;
        try {
            const hashedPassword = await bcrypt.hash(this.password, saltRounds);
            this.password = hashedPassword;
        }
        catch (error) {
            throw new Error('Error hashing password');
        }
    }
}
