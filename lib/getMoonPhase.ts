import axios from 'axios'

export async function getMoonPhase() {
  const options = {
    method: 'GET',
    url: 'https://moon-phase.p.rapidapi.com/advanced',
    params: {
      lat: '51.4768',
      lon: '-0.0004',
    },
    headers: {
      'x-rapidapi-key': process.env.RAPIDAPI_KEY,
      'x-rapidapi-host': 'moon-phase.p.rapidapi.com',
    },
  }

  const response = await axios.request(options)
  return response.data
}
