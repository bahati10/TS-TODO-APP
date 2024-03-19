// External Dependencies
// Class Implementation
export default class Todo {
    constructor(title, category, done = false, description, DateAdded = new Date(), id) {
        this.title = title;
        this.category = category;
        this.done = done;
        this.description = description;
        this.DateAdded = DateAdded;
        this.id = id;
    }
}
