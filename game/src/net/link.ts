import type { FromRoom } from './protocol';

export interface Link {
  send(message: object): void;
  close(): void;
}

/**
 * La conexión con la sala. Si se corta, vuelve a intentar sola y se presenta de nuevo con [hello]:
 * así un celular que perdió el Wi-Fi un segundo vuelve a su mismo auto.
 */
export function connect(hello: () => object, onMessage: (message: FromRoom) => void, onLine: (up: boolean) => void): Link {
  let socket: WebSocket | null = null;
  let closed = false;
  let wait = 300;
  const open = () => {
    if (closed) return;
    const ws = new WebSocket(`${location.protocol === 'https:' ? 'wss' : 'ws'}://${location.host}/api/carrera/socket`);
    socket = ws;
    ws.onopen = () => {
      wait = 300;
      ws.send(JSON.stringify(hello()));
      onLine(true);
    };
    ws.onmessage = (event) => {
      try {
        onMessage(JSON.parse(String(event.data)) as FromRoom);
      } catch {
        // Un mensaje que no se entiende no tira la conexión.
      }
    };
    ws.onclose = () => {
      if (socket !== ws) return;
      socket = null;
      onLine(false);
      setTimeout(open, wait);
      wait = Math.min(wait * 2, 3000);
    };
  };
  open();
  return {
    send(message) {
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify(message));
    },
    close() {
      closed = true;
      socket?.close();
    },
  };
}
