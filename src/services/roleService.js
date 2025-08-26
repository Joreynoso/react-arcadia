import Role from '../models/Role.js'
import RoleRepository from '../repositories/roleRepository.js'
import mongoose from 'mongoose'

class RoleService {
    // --> lista de permisos
    async listRoles() {
        return RoleRepository.getAll()
    }

    // --> buscar un role por id
    async getRoleById(id) {
        return RoleRepository.getById(id)
    }

    // --> crear un nuevo rol
    async createRole(data) {
        return RoleRepository.create(data)
    }

    // --> actualizar un rol
    async updateRole(id, data) {
        return RoleRepository.update(id, data)
    }

    // --> eliminar un rol
    async deleteRole(id) {
        return RoleRepository.delete(id)
    }

    // --> asignar un rol a un usuario
    async assignUserRole(userId, roleId) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            throw new Error('Usuario Id invalido')
        }

        if (!mongoose.Types.ObjectId.isValid(roleId)) {
            throw new Error('Rol Id invalido')
        }

        const updateUser = await RoleRepository.assignRole(userId, roleId)

        if (!updateUser) {
            throw new Error('Usuario no encontrado')
        }

        return updateUser
    }
}

export default new RoleService()
