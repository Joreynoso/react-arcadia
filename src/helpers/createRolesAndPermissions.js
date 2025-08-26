import connectDB from "../config/connectDB.js"
import Permission from "../models/Permission.js"
import mongoose from "mongoose"
import Role from "../models/Role.js"

const permissions = [
  // Juegos
  { name: "read:games", description: "Ver juegos" },
  { name: "add:game", description: "Agregar juegos" },
  { name: "update:game", description: "Editar juegos" },
  { name: "delete:game", description: "Eliminar juegos" },
  { name: "load:games", description: "Precargar Juegos" },

  // Favoritos
  { name: "read:favorites", description: "Ver juegos favoritos" },
  { name: "add:favorite", description: "Agregar juego favorito" },
  { name: "delete:favorite", description: "Eliminar juego favorito" },

  // Roles
  { name: "assign:role", description: "Asignar rol a usuarios" },
  { name: "read:roles", description: "Ver roles" },
  { name: "add:role", description: "Crear role" },
  { name: "update:role", description: "Editar role" },
  { name: "delete:role", description: "Eliminar role" },

  // Permisos
  { name: "read:permissions", description: "Ver permisos" },
  { name: "add:permission", description: "Crear permiso" },
  { name: "update:permission", description: "Editar permiso" },
  { name: "delete:permission", description: "Eliminar permiso" },

  // Usuarios
  { name: "read:profile", description: "Ver su propio perfil" },
  { name: "read:users", description: "Ver usuarios" },
  { name: "delete:user", description: "Eliminar usuario" },
]

const roles = [
  {
    name: "user",
    description: "Usuario básico",
    permissions: [
      "read:profile",
      "read:games",
      "read:favorites",
      "add:favorite",
      "delete:favorite",
    ],
  },
  {
    name: "editor",
    description: "Editor de contenido",
    permissions: [
      // permisos de user
      "read:profile",
      "read:games",
      "read:favorites",
      "add:favorite",
      "delete:favorite",

      // extra de editor
      "add:game",
      "update:game",
    ],
  },
  {
    name: "admin",
    description: "Administrador",
    permissions: [
      "read:profile",
      "read:games",
      "add:game",
      "update:game",
      "delete:game",
      "load:games",
      "read:favorites",
      "add:favorite",
      "delete:favorite",
      "assign:role",
      "read:roles",
      "add:role",
      "update:role",
      "delete:role",
      "read:permissions",
      "add:permission",
      "update:permission",
      "delete:permission",
      "read:users",
      "delete:user",
    ],
  },
]

const init = async () => {
  await connectDB()

  // Insertar o actualizar permisos
  for (const perm of permissions) {
    await Permission.findOneAndUpdate(
      { name: perm.name },
      { $set: perm },
      { upsert: true, new: true }
    )
  }

  const allPermissions = await Permission.find()
  const permMap = allPermissions.reduce((map, perm) => {
    map[perm.name] = perm._id
    return map
  }, {})

  // Insertar o actualizar roles
  for (const r of roles) {
    await Role.findOneAndUpdate(
      { name: r.name },
      {
        name: r.name,
        description: r.description,
        permissions: r.permissions.map((p) => permMap[p]),
      },
      { upsert: true, new: true }
    )
  }

  console.log("Roles y permisos inicializados")
  mongoose.disconnect()
}

init()
