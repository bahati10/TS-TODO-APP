// External Dependencies
// Class Implementation
export default class Todo {
    constructor(name, category, description, DateAdded = new Date(), id) {
        this.name = name;
        this.category = category;
        this.description = description;
        this.DateAdded = DateAdded;
        this.id = id;
    }
}
