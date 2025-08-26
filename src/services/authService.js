import userModel from "../models/User.js"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import dotenv from 'dotenv'
import Role from '../models/Role.js'

dotenv.config()

class AuthService {

  // --> Registrar un nuevo usuario
  async register(userData) {
    // Revisamos si ya existe un usuario con el mismo email o username
    const userExisting = await userModel.findOne({
      $or: [{ email: userData.email }, { username: userData.username }],
    })

    // Si existe, lanzamos un error para que no se duplique
    if (userExisting) {
      throw new Error("El usuario ya existe")
    }

    // Encriptamos la contraseña usando bcrypt antes de guardarla
    // El número 10 indica la cantidad de "salt rounds" para la encriptación
    const hashedPassword = await bcrypt.hash(userData.password, 10)

    // Definir un rol por defecto
    const defaultRole = await Role.findOne({ name: 'user' })

    // validar
    if (!defaultRole) throw new Error("Rol por defecto no encontrado")

    // Creamos una nueva instancia del modelo User con los datos recibidos
    // Reemplazamos la contraseña original por la versión encriptada
    const newUser = new userModel({
      ...userData,
      password: hashedPassword,
      role: defaultRole._id
    })

    // Guardamos el nuevo usuario en la base de datos
    await newUser.save()
    console.log("Usuario guardado:", newUser)

    // Convertimos el documento de Mongoose a un objeto plano (POJO)
    const newUserResponse = newUser.toObject()

    // Eliminamos la contraseña para no exponerla en la respuesta
    delete newUserResponse.password

    // Generamos un token JWT para autenticación futura
    const token = this.generateToken(newUser)

    // Retornamos la información del usuario y el token
    return {
      user: newUserResponse,
      token,
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
    // Buscamos al usuario por su email en la base de datos
    const user = await userModel.findOne({ email })

    // Si el usuario no existe, lanzamos un error para que el controlador lo maneje
    if (!user) {
      throw new Error("El usuario no existe")
    }

    // Verificamos la contraseña
    // Comparamos el password enviado en la petición con el hash almacenado en la base de datos
    const isValidPassword = await bcrypt.compare(password, user.password)

    // Si la contraseña no coincide, lanzamos un error
    if (!isValidPassword) {
      throw new Error("Correo o contraseña incorrecta")
    }

    // Convertimos el documento Mongoose a un objeto plano (POJO)
    const userResponse = user.toObject()

    // Eliminamos la contraseña para no exponerla en la respuesta
    delete userResponse.password

    // Generamos un token JWT para autenticar al usuario en futuras peticiones
    const token = this.generateToken(user)

    // Retornamos la información del usuario y el token
    return {
      user: userResponse,
      token
    }
  }

}

export default new AuthService