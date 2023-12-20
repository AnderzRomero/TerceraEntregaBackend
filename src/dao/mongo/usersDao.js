import userModel from "./models/user.model.js";

export default class usersDao {
    get = (params) => {
        return userModel.find(params).lean();
    }

    getBy = (params) => {
        return userModel.findOne(params).lean();
    }

    create = (user) => {
        return userModel.create(user);
    }

    update = (id, user) => {
        return userModel.updateOne({ _id: id }, user);
    }

    delete = (id) => {
        return userModel.updateOne({ _id: id }, { $set: { activate: false } });
    }
}