import { VercelRequest, VercelResponse } from '@vercel/node'
import axios from 'axios'

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  try {
    const { data } = await axios({
      url: `https://tianqi.2345.com${request.url}`,
      method: request.method,
      headers: {
        'Referer': 'https://tianqi.2345.com',
        'Origin': 'https://tianqi.2345.com'
      }
    })

    response.status(200).json(data)
  } catch (error) {
    response.status(500).json({ error: 'Failed to fetch data' })
  }
} 