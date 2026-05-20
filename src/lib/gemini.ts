import { GoogleGenerativeAI } from '@google/generative-ai'

const apiKey = import.meta.env.VITE_GEMINI_API_KEY
export const isGeminiConfigured = !!apiKey

export const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null
export const model = genAI ? genAI.getGenerativeModel({ model: 'gemini-1.5-flash' }) : null
