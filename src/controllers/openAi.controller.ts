import 'dotenv/config'
import { Request, Response } from 'express';

import AIClass from '../services/openai.class';

const ai = new AIClass(process.env.OPEN_AI_KEY!);

export async function generateImage (req: Request, res: Response) {

  const { history } = req.body;
  
  try {

    const prompt = 'Imagina que eres un diseñador gráfico y un cliente te ha pedido que diseñes unas tarjetas de presentación. Siempre deberás basarte en la conversación del historial, que es la siguiente: [{history}]. Crea dos propuestas de diseño que sean elegantes y modernas.'.replace('{history}', history);
   
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