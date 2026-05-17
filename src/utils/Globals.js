export default class Globals {
    constructor () {
        this.values = {};
    }

    get (name) {
        return this.values[name];
    }

    set (name, value) {
        console.log('set', name, value);
        if (name === 'currentTarget' && value === undefined) {
            throw new Error();
        }
        this.values[name] = value;
    }
}
