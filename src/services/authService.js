import userModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import Role from '../models/Role.js'

dotenv.config()

class AuthService {

  // --> Registrar un nuevo usuario
  async register(userData) {
    // 1. Validar existencia de usuario
    console.log('entrando a la función...')
    const userExisting = await userModel.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    })
    if (userExisting) {
      throw new Error("El usuario ya existe")
    }

    // 2. Hashear contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // 3. Obtener rol por defecto
    const defaultRole = await Role.findOne({ name: 'user' }).populate('permissions')
    if (!defaultRole) throw new Error("Rol por defecto no encontrado")

    // 4. Crear usuario
    const newUser = new userModel({
      ...userData,
      password: hashedPassword,
      role: defaultRole._id
    })
    await newUser.save()

    console.log('new user saved', newUser)

    // 5. Recuperar usuario ya poblado con rol + permisos
    const populatedUser = await userModel.findById(newUser._id).populate({
      path: 'role',
      populate: { path: 'permissions' }
    })

    console.log('populate permissions', populatedUser)

    // 6. Preparar respuesta segura
    const userResponse = populatedUser.toObject()
    delete userResponse.password

    console.log('user response', userResponse)

    // 7. Generar token
    const token = this.generateToken(populatedUser)

    return {
      user: userResponse,
      token
    }
  }

  // --> Método auxiliar para generar un token JWT
  generateToken(user) {
    // Creamos un token que incluye información mínima del usuario
    // Solo ponemos el id para identificarlo y mantenerlo seguro
    // Podrías agregar más info si es necesario (ej. rol, permisos)
    return jwt.sign(
      {
        id: user._id,
        role: user.role, // Payload: información que queremos guardar dentro del token
      },
      process.env.JWT_SECRET, // Clave secreta para firmar y verificar el token
      { expiresIn: "24h" } // Tiempo de expiración del token
    )
  }

  // --> Login de un usuario
  async login(email, password) {

    // 1. Buscar usuario y poblar rol + permisos
    const user = await userModel.findOne({ email }).populate({
      path: 'role',
      populate: { path: 'permissions' }
    })

    if (!user) {
      throw new Error("El usuario no existe")
    }

    // 2. Verificar contraseña
    const isValidPassword = await bcrypt.compare(password, user.password)
    if (!isValidPassword) {
      throw new Error("Correo o contraseña incorrecta")
    }


    // 3. Preparar respuesta segura
    const userResponse = user.toObject()
    delete userResponse.password

    // 4. Generar token con usuario poblado
    const token = this.generateToken(user)

    // 5. Retornar usuario + rol con permisos
    return {
      user: userResponse,
      token
    }
  }
}

export default new AuthService