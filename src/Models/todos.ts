// External Dependencies
import { ObjectId } from "mongodb";

// Class Implementation
export default class Todo {
    constructor(public name: string, public category: string, public DateAdded: Date = new Date(), public id?: string) {}
}
