import axios, { AxiosError } from 'axios'

export async function getMoonPhase() {
  const apiKey = process.env.RAPIDAPI_KEY
  if (!apiKey) throw new Error('RAPIDAPI_KEY environment variable is not set.')

  try {
    const response = await axios.request({
      method: 'GET',
      url: 'https://moon-phase.p.rapidapi.com/advanced',
      params: { lat: '51.4768', lon: '-0.0004' },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'moon-phase.p.rapidapi.com',
      },
      timeout: 8000,
    })
    return response.data
  } catch (err) {
    const message =
      err instanceof AxiosError
        ? `Moon phase API error: ${err.response?.status ?? ''} ${err.message}`
        : err instanceof Error
        ? err.message
        : 'Unknown error fetching moon phase'
    throw new Error(message)
  }
}
