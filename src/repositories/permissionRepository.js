import Permission from '../models/Permission.js'

class PermissionRepository {

    async getAll() {
        return Permission.find({})
    }

    async getById(id) {
        return Permission.findById(id)
    }

    async getByName(name){
        return Permission.findOne({ name })
    }

    async create(data) {
        return Permission.create(data)
    }

    async update(id, data) {
        return Permission.findOneAndUpdate(id, data, { new: true })
    }

    async delete(id) {
        return Permission.findOneAndDelete(id)
    }
}

export default new PermissionRepository()