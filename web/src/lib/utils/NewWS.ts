const HOST = import.meta.env.VITE_BACKEND_HOST;

export const NewWS = () => {
  if (!window && !WebSocket) {
    return null;
  }

  const hostUrl = HOST.includes('https') ? `wss://${HOST.replace('https://', '')}` : `ws://${HOST.replace('http://', '')}`;

  return new WebSocket(`${hostUrl}/ws`);
}