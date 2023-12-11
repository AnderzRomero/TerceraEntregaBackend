export default class SessionsService {
    constructor(manager) {
        this.manager = manager;
    }

    getUsers = (params) => {
        return this.manager.get(params);
    }
    getUser = (params) => {
        return this.manager.getBy(params);
    }
    createUser = (user) => {
        return this.manager.create(user);
    }
    updateUser = (id, user) => {
        return this.manager.update(id, user);
    }
    deleteUser = (id) => {
        return this.manager.delete(id);
    }
}