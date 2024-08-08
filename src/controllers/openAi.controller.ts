import 'dotenv/config'
import { Request, Response } from 'express';

import AIClass from '../services/openai.class';

const ai = new AIClass(process.env.OPEN_AI_KEY!);

export async function generateImage (req: Request, res: Response) {

  const { history } = req.body;
  
  console.log('esto es lo que llega', req.body)
  try {


    const prompt = 'Imagina que eres un diseñador gráfico y que un cliente te pide que diseñes unas tarjetas de presentación, esto siempre lo harás básandote en el historial que es el siguiente [{history}], debe ser un diseño elegante y moderno, el consultorio se llama odontoflex, realizas 2 propuestas'.replace('{history}', history);
   
   
    const image = await ai.generateImage(prompt);

    const response = {
      messages: [
        {
          type: 'to_user', 
          media_url: image,
          content: 'ejemplo',
        }
      ]
    }

    res.status(200).send(response);
  } catch (error) {
    console.error('errosss: ', error)
  }
};