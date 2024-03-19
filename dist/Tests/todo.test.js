export default class Todo {
    constructor(name, category, DateAdded = new Date(), id) {
        this.name = name;
        this.category = category;
        this.DateAdded = DateAdded;
        this.id = id;
    }
}
describe('Todo Class', () => {
    it('should create a Todo object with default DateAdded', () => {
        const todo = new Todo('Task 1', 'General');
        expect(todo).toHaveProperty('name', 'Task 1');
        expect(todo).toHaveProperty('category', 'General');
        expect(todo).toHaveProperty('DateAdded');
        expect(todo).toHaveProperty('id');
    });
    it('should create a Todo object with custom DateAdded', () => {
        const customDate = new Date('2024-03-20T12:00:00Z');
        const todo = new Todo('Task 2', 'Personal', customDate);
        expect(todo).toHaveProperty('name', 'Task 2');
        expect(todo).toHaveProperty('category', 'Personal');
        expect(todo).toHaveProperty('DateAdded', customDate);
        expect(todo).toHaveProperty('id');
    });
});
