import UserRepository from '../repositories/userRepository.js'
import mongoose from 'mongoose'

class UserService {
    // --> lista de usuarios
    async listUsers() {
        return UserRepository.getAll()
    }

    // --> buscar un usuario por ID
    async getUser(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('ID invalido')
        }
        return UserRepository.getById(id)
    }

    // --> eliminar un usuario
    async deletUser(id) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new Error('Id invalido')
        }

        const userDeleted = await UserRepository.delete(id)

        return userDeleted
    }
}

export default new UserService()
