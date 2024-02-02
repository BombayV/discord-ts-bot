const serversMap = new Map<string, boolean>();

export const addServer = (serverId: string, isAlive: boolean) => {
  serversMap.set(serverId, isAlive);
}

export const removeServer = (serverId: string) => {
  serversMap.delete(serverId);
}

export const hasServer = (serverId: string) => {
  if (serversMap.has(serverId)) {
    return serversMap.get(serverId);
  }

  return false;
}