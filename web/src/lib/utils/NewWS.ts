export const NewWS = () => {
  if (!window && !WebSocket) {
    return null;
  }

  return new WebSocket(`ws://${import.meta.env.VITE_BACKEND_HOST}/ws`);
}