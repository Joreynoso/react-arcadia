import UserService from '../services/userService.js'

class UserController {
    // --> obtener perfil del usuario
    async getOwnProfile(req, res) {
        try {
            const user = await UserService.getUser(req.user.id)

            console.log('1. usario proveniente del middleware', user)

            res.status(200).json({ succes: true, message: 'Perfil del usuario', user })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }
    // --> lista de usuarios
    async getAll(req, res) {
        try {
            const users = await UserService.listUsers()
            if (!users || users.length === 0) {
                return res.status(404).json({ succes: false, message: 'no se encontraro usuarios' })
            }
            res.status(200).json({ succes: true, message: 'Lista de usuarios', users })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }

    // --> buscar un urusario por id
    async getById(req, res) {
        try {
            const { id } = req.params
            const user = await UserService.getUser(id)
            if (!user) return res.status(404).json({ succes: false, message: 'Usuario no encontrado' })
            res.status(200).json({ succes: true, message: 'Usuario encontrado', user })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }

    // --> eliminar un usuario
    async delete(req, res) {
        try {
            const { id } = req.params
            const user = await UserService.deletUser(id)
            if (!user) return res.status(404).json({ succes: false, message: 'Usuario no encontrado' })
            res.status(200).json({ succes: true, message: 'Usuario eliminado', user })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }
}

export default new UserController()
