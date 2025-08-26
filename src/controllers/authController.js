import AuthService from '../services/authService.js'

class AuthController {
  // --> user login
  async userLogin(req, res) {
    try {
      const { email, password } = req.body
      const result = await AuthService.login(email, password)
      return res.status(201).json({ result: result, succes: true, message: "userLogin - ok" })
    } catch (error) {
      console.error(error.message)
      return res.status(400).json({ succes: false, message: error.message })
    }
  }

  // --> user register
  async userRegister(req, res) {
    try {
      const result = await AuthService.register(req.body)

      return res.status(201).json({ succes: true, message: "userRegister - ok", result: result })
    } catch (error) {
      console.error(error.message)
      return res.status(401).json({ succes: false, message: error.message })
    }
  }
}

export default new AuthController

