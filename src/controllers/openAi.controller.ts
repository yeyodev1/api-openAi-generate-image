import 'dotenv/config'
import { Request, Response } from 'express';

import AIClass from '../services/openai.class';

const ai = new AIClass(process.env.OPEN_AI_KEY!);

export async function generateImage (req: Request, res: Response) {
  try {
    const image = await ai.generateImage('Imagina que eres un diseñador gráfico y que un cliente te pide que diseñes unas tarjetas de presentación para un consultorio, debe ser un diseño elegante y moderno, el consultorio se llama odontoflex, realizas 2 propuestas,');

    res.status(200).json({image});
  } catch (error) {
    console.error('errosss: ', error)
  }
};