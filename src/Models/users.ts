// User.ts

// Class Implementation
export default class User {
    constructor(
        public names: string,
        public username: string,
        public email: string,
        public password: string,
        public createdAt: Date = new Date(),
        public id?: string
    ) {}
}
 