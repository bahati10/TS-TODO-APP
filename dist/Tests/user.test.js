import bcrypt from 'bcryptjs';
import User from '../Models/users.js';
// Mock bcrypt hash function
jest.mock('bcryptjs', () => ({
    hash: jest.fn().mockImplementation((password, _saltRounds) => Promise.resolve(`hashed_${password}`))
}));
describe('User Class', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should create a User object with default createdAt', () => {
        const user = new User('John Doe', 'johndoe', 'john@example.com', 'password');
        expect(user).toHaveProperty('names', 'John Doe');
        expect(user).toHaveProperty('username', 'johndoe');
        expect(user).toHaveProperty('email', 'john@example.com');
        expect(user).toHaveProperty('password', 'password');
        expect(user).toHaveProperty('createdAt');
        expect(user).toHaveProperty('id');
    });
    it('should create a User object with custom createdAt', () => {
        const customDate = new Date('2024-03-20T12:00:00Z');
        const user = new User('Jane Doe', 'janedoe', 'jane@example.com', 'password', customDate);
        expect(user).toHaveProperty('names', 'Jane Doe');
        expect(user).toHaveProperty('username', 'janedoe');
        expect(user).toHaveProperty('email', 'jane@example.com');
        expect(user).toHaveProperty('password', 'password');
        expect(user).toHaveProperty('createdAt', customDate);
        expect(user).toHaveProperty('id');
    });
    it('should hash password when calling hashPassword method', async () => {
        const user = new User('John Doe', 'johndoe', 'john@example.com', 'password');
        await user.hashPassword();
        expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
        expect(user.password).toBe('hashed_password');
    });
    it('should throw error when hashPassword method fails', async () => {
        bcrypt.hash.mockRejectedValue(new Error('Mocked hash error'));
        const user = new User('John Doe', 'johndoe', 'john@example.com', 'password');
        await expect(user.hashPassword()).rejects.toThrow('Error hashing password');
    });
});
