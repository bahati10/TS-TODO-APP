// External Dependencies
// Class Implementation
export default class Todo {
    constructor(name, category, DateAdded = new Date(), id) {
        this.name = name;
        this.category = category;
        this.DateAdded = DateAdded;
        this.id = id;
    }
}
