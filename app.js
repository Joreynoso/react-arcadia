import express from "express"
import authRouter from "./src/routes/auth.js"
import connectDB from "./src/config/connectDB.js"
import cors from 'cors'
import permissionRouter from './src/routes/permissionRoutes.js'
import userRouter from './src/routes/userRoutes.js'
import roleRouter from './src/routes/roleRoutes.js'
import dotenv from 'dotenv'
import gameRouter from "./src/routes/GamesRoutes.js"
import favoriteRouter from './src/routes/favoriteRoutes.js'

// Iniciar el env
dotenv.config()

// Instanciar Express
const app = express()
const port = process.env.PORT || 3000

// cors options
const corsOptions = {
  origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  credentials: true,
  maxAge: 86400 // 24 horase en segundos
}

// Middleware para parsear cuerpos JSON
app.use(cors(corsOptions))
app.use(express.json())

// connect to mongodb
connectDB()

// Quitar mensaje de favicon molesto
app.use((req, res, next) => {
  if (req.originalUrl === "/favicon.ico") return res.status(204).end()
  next()
})

// Middleware personalizado para mensajes en consola
app.use((req, res, next) => {
  console.log(`--> [REQUEST] ${req.method} [URL] ${req.url}`)
  next()
})

// Rutas auth
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/role", roleRouter)
app.use("/api/permissions", permissionRouter)
app.use("/api/games", gameRouter)
app.use("/api/favorites", favoriteRouter)

// Ruta principal
app.get("/api", (req, res) => {
  res.json({ mesage: "server running" })
})

// Iniciar servidor
app.listen(port, () => {
  console.log(`--> [SERVER] http://localhost:${port}`)
})
