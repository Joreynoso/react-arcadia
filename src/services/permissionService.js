import PermissionRepository from "../repositories/permissionRepository.js"

class PermissionService {
  // --> lista de permisos
  async listPermissions() {
    return PermissionRepository.getAll()
  }

  // --> buscar un permiso por iD
  async getPermission(id) {
    return PermissionRepository.getById(id)
  }

  // --> crear un nuevo permiso
  async createPermission(data) {
    return PermissionRepository.create(data)
  }

  // --> actualizar un permiso
  async updatePermission(id, data) {
    return PermissionRepository.update(id, data)
  }

  // --> borrar un permiso
  async deletePermission(id) {
    return PermissionRepository.delete(id)
  }
}

export default new PermissionService()
