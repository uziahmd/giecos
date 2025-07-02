import { AIRWALLEX_CLIENT_ID, AIRWALLEX_API_KEY } from '../env'

export async function getAirwallexToken(): Promise<string> {
  const resp = await fetch('https://api.airwallex.com/api/v1/authentication/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: AIRWALLEX_CLIENT_ID,
      api_key: AIRWALLEX_API_KEY,
    }),
  })
  if (!resp.ok) {
    throw new Error('Failed to get Airwallex token')
  }
  const data = await resp.json() as { token: string }
  return data.token
}
