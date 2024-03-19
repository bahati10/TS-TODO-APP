// External Dependencies

// Class Implementation
export default class Todo {
    constructor(public title: string, public category: string,  public done: boolean = false, public description: string, public DateAdded: Date = new Date(), public id?: string) {}
}
