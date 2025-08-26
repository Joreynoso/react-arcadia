// --> imports
import jwt from 'jsonwebtoken'
import User from '../models/User.js'

// --> middleware
export const authenticateToken = (req, res, next) => {
    // obtenemos el header de autorización
    // formato esperado: "Bearer <token>"
    const authHeader = req.headers['authorization']

    // separamos el header por espacios y tomamos el segundo elemento
    // es decir, el token real (index 0 = "Bearer", index 1 = "<token>")
    const token = authHeader && authHeader.split(' ')[1]

    // si no hay token, devolvemos un error 401 (no autorizado)
    if (!token) return res.status(401).json({ error: 'Token no proporcionado' })

    try {
        // verificamos el token usando la clave secreta del .env
        // si el token es válido, devuelve la información decodificada (payload)
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // guardamos la información del usuario decodificada en req.user
        // para que los siguientes middlewares o rutas puedan acceder a ella
        req.user = decoded

        // continuamos con la siguiente función del middleware o ruta
        next()
    } catch (error) {
        // si el token es inválido, devolvemos un error 403 (prohibido)
        return res.status(403).json({ error: 'Token inválido' })
    }
}

// --> Middleware para verificar permisos
export const hasPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            // Si no hay un usuario autenticado en la request, devolvemos error
            if (!req.user) {
                console.log('--> [MIDDLEWARE PERMISSION] usuario no autenticado')
                return res.status(401).json({ message: 'Usuario no autenticado' })
            }

            // Buscamos al usuario en la base de datos con su rol y sus permisos
            // - role: se popula con el rol asignado al usuario
            // - permissions: dentro del rol, se popula la lista de permisos
            const user = await User.findById(req.user.id)
                .populate({
                    path: 'role',
                    populate: {
                        path: 'permissions'
                    }
                })

            // Verificamos si el usuario tiene el permiso requerido
            const hasPermission = user.role.permissions.some(
                permission => permission.name === requiredPermission
            )

            // Si no tiene el permiso, devolvemos error 403 (prohibido)
            if (!hasPermission) {
                return res.status(403).json({
                    message: 'No tienes permiso para realizar esta acción'
                })
            }

            // Si el usuario está autenticado y tiene permiso, continuamos
            next()
        } catch (error) {
            // Si ocurre cualquier error, lo pasamos al manejador de errores global
            next(error)
        }
    }
}
