import User from '../models/User.js'

class UserRepository {

    async getAll() {
        return User.find()
            .populate({
                path: 'role',
                populate: {
                    path: 'permissions',
                    select: 'name -_id'   // traer solo el nombre del permiso
                },
                select: 'name description -_id'  // traer solo campos relevantes del rol
            })
            .select('username email role')  // traer solo los campos que quieres mostrar en la tabla
    }

    async getById(id) {
        return User.findById(id)
            .populate({
                path: "role",
                populate: { path: "permissions", select: "name description -_id" },
                select: "name description permissions -_id"
            })
    }

    async getByName(name) {
        return User.findOne({ name })
    }

    async delete(id) {
        return User.findOneAndDelete(id)
    }
}

export default new UserRepository()