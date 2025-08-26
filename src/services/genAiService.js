import { GoogleGenAI } from '@google/genai'
import dotenv from 'dotenv'

// dotenv
dotenv.config()

// apike from env
const apikey = process.env.GEMINI_API_KEY

// crear agente
const ai = new GoogleGenAI({ apiKey: apikey })


// función para recibir un sumario de un juego
export const getSummaryFromAi = async ({ name, released }) => {

    try {

        // prompt
        const prompt = `Escribe un resumen breve y atractivo del videojuego "${name}", 
        lanzado en ${released}. En español, tono neutro, sin spoilers, no más de 50 palabras
        en lo posible`

        // response
        const response = await ai.models.generateContent({
            model: "gemini-2.0-flash",  //
            contents: [{ text: prompt }],
            config: {
                thinkingConfig: { thinkingBudget: 0 } // más rápido
            }
        })

        // caso exito
        return response.text || ""

    } catch (error) {
        console.error('Error al consultar google gen ai', error)
        return null
    }
}