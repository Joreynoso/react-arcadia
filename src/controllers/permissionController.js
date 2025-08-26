import PermissionService from "../services/permissionService.js"

class PermissionController {

  // --> lista de permisos
  async getAll(req, res) {
    try {
      console.log('antes de listar permisos...')
      const permissions = await PermissionService.listPermissions()
      console.log('después de listar permisos', permissions)

      console.log("-->[CONTROLLER]", permissions)
      if (!permissions || permissions.length === 0) {
        return res.status(404).json({ succes: false, message: "No se encontraron permissions" })
      }
      res.status(200).json({ succes: true, message: "Lista de permisos", permissions })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> buscar un permiso por id
  async getById(req, res) {
    try {
      const { id } = req.params
      const permission = await PermissionService.getPermission(id)

      if (!permission) {
        return res.status(404).json({ succes: false, message: "Permiso no encontrado" })
      }

      res.status(200).json({ succes: true, message: "Permiso encontrado", permission })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> crear un permiso nuevo
  async create(req, res) {
    try {
      const { name, description } = req.body

      if (!name || !description) {
        return res.status(400).json({ succes: false, message: "Faltan campos obligatorios" })
      }

      const permission = await PermissionService.createPermission(req.body)
      res.status(201).json({ succes: true, message: "Permiso creado", permission })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> actualizar un permiso
  async update(req, res) {
    try {
      const { id } = req.params
      const data = req.body

      const updated = await PermissionService.updatePermission(id, data)

      if (!updated) {
        return res.status(404).json({ succes: false, message: "Permiso no encontrado" })
      }

      res.status(200).json({ succes: true, message: "Permiso actualizado", updated })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }

  // --> elminiar un permiso
  async delete(req, res) {
    try {
      const { id } = req.params
      const permissionExist = await PermissionService.getPermission(id)

      if (!permissionExist) {
        return res.status(404).json({ succes: false, message: "Permiso no encontrado" })
      }

      const permission = await PermissionService.deletePermission(id)

      res.status(200).json({ succes: true, message: "Permiso borrado", permission })
    } catch (error) {
      console.error(error.message)
      return res.status(500).json({ succes: false, message: error.message })
    }
  }
}

export default new PermissionController()
