import Groq from "groq-sdk"
import dotenv from "dotenv"

dotenv.config()

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
})

export const getSummaryFromAi = async ({ name, released }) => {
  try {
    const prompt = `Escribe un resumen breve e informativo del videojuego "${name}", 
lanzado en ${released}. Describe su ambientación, el tipo de experiencia que ofrece al jugador, 
y destaca si es muy popular, relevante en la industria o si ha recibido premios. 
La reseña debe ser clara, objetiva y no superar las 75 palabras.`

    const completion = await groq.chat.completions.create({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    })

    return completion.choices?.[0]?.message?.content || ""
  } catch (error) {
    console.error("Error al consultar Groq", error)
    return null
  }
}