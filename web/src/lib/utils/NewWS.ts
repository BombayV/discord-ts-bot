const HOST = import.meta.env.VITE_BACKEND_HOST;

export const NewWS = () => {
  if (!window && !WebSocket) {
    return null;
  }

  const hostUrl = HOST.includes('http') ? `wss://${HOST.replace('https://', '')}` : `wss://${HOST}`;

  return new WebSocket(`${hostUrl}/ws`);
}