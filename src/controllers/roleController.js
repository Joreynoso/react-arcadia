import RoleService from '../services/roleService.js'

class RoleController {
    // --> lista de roles
    async getAll(req, res) {
        try {
            const roles = await RoleService.listRoles()

            if (!roles || roles.length === 0) {
                return res.status(404).json({ succes: false, message: 'No se encontraron roles' })
            }

            res.status(200).json({ succes: true, message: 'Lista de roles', roles })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }

    // --> buscar un rol por ID
    async getById(req, res) {
        try {
            const { id } = req.params
            const role = await RoleService.getRoleById(id)
            if (!role) return res.status(404).json({ succes: false, message: 'Rol no encontrado' })
            res.status(200).json({ succes: true, message: 'Rol encontrado', role })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }

    // --> crear un nuevo rol
    async create(req, res) {
        try {
            console.log(req.body)
            const role = await RoleService.createRole(req.body)
            res.status(201).json({ succes: true, message: 'Rol creado', role })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }

    // --> actualizar un rol
    async update(req, res) {
        try {
            const { id } = req.params
            const role = await RoleService.updateRole(id, req.body)
            if (!role) return res.status(404).json({ succes: false, message: 'Rol no encontrado' })
            res.status(200).json({ succes: true, message: 'Rol actualizado', role })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }

    // --> eliminar un rol
    async delete(req, res) {
        try {
            const { id } = req.params
            const role = await RoleService.deleteRole(id)
            if (!role) return res.status(404).json({ succes: false, message: 'Rol no encontrado' })
            res.status(200).json({ succes: true, message: 'Rol eliminado', role })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }


    // --> asignar un rol a un usuario
    async assignRole(req, res) {
        try {
            console.log('1. entrando a la función')
            const { id } = req.params
            const { roleid } = req.body

            console.log('2. datos entrantes', id, roleid)

            const userUpdated = await RoleService.assignUserRole(id, roleid)

            if (!userUpdated) {
                return res.status(404).json({ success: false, message: 'Usuario no encontrado' })
            }

            res.status(200).json({ succes: true, message: 'Rol agregado al usuario' })
        } catch (error) {
            console.error(error)
            res.status(500).json({ succes: false, message: error.message })
        }
    }
}

export default new RoleController()
