type EventType = '/setNickname'

export const fetcher = async <T = any>(event: EventType, data: T, method: string = 'POST') => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_HOST}${event}`, {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    throw new Error('An error occurred while fetching the data');
  }

  console.log('fetcher.ts: fetcher: res.json()')
  console.log(res.json())
  return res.json();
}