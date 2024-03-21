import bcrypt from 'bcryptjs';

export default class User {
    constructor(
        public names: string,
        public username: string,
        public email: string,
        public password: string,
        public createdAt: Date = new Date(),
        public id?: string
    ) {}

    async hashPassword(): Promise<void> {
        const saltRounds = 10;

        try {
            const hashedPassword = await bcrypt.hash(this.password, saltRounds);
            this.password = hashedPassword;
        } catch (error) {
            throw new Error('Error hashing password');
        }
    }
}
