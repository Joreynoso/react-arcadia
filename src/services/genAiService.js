import { GoogleGenAI } from "@google/genai"
import dotenv from "dotenv"

// dotenv
dotenv.config()

// apike from env
const apikey = process.env.GEMINI_API_KEY

// crear agente
const ai = new GoogleGenAI({ apiKey: apikey })

// función para recibir un sumario de un juego
export const getSummaryFromAi = async ({ name, released }) => {
  try {
    const prompt = `Escribe un resumen breve e informativo del videojuego "${name}", 
    lanzado en ${released}. Describe su ambientación, el tipo de experiencia que ofrece al jugador, 
    y destaca si es muy popular, relevante en la industria o si ha recibido premios. 
    La reseña debe ser clara, objetiva y no superar las 75 palabras.`

    // response
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash", //
      contents: [{ text: prompt }],
      config: {
        thinkingConfig: { thinkingBudget: 0 }, // más rápido
      },
    })

    // caso exito
    return response.text || ""
  } catch (error) {
    console.error("Error al consultar google gen ai", error)
    return null
  }
}
