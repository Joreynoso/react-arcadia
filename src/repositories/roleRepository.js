import Role from '../models/Role.js'
import User from '../models/User.js'

class RoleRepository {
    async getAll() {
        return Role.find().populate('permissions')
    }

    async getById(id) {
        return Role.findById(id).populate('permissions')
    }

    async getByName(filter) {
        return Role.findOne(filter)
    }

    async create(data) {
        const role = new Role(data)
        return role.save()
    }

    async update(id, data) {
        return Role.findByIdAndUpdate(id, data, { new: true }).populate('permissions')
    }

    async delete(id) {
        return Role.findByIdAndDelete(id)
    }

    async assignRole(userId, roleId) {
        return User.findByIdAndUpdate(
            userId,
            { role: roleId },
            { new: true }
        )
    }
}

export default new RoleRepository()
