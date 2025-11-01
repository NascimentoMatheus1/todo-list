export default class Todo {
    constructor(name){
        this.name = name;
        this.date = undefined;
    }

    setName(name) {
        this.name = name
    }

    getName() {
        return this.name
    }

    setDate(date){
        this.date = date;
    }

    getDate() {
        return this.date
    }
}