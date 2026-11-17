import type { FromRoom } from './protocol';

export interface Link {
  send(message: object): void;
  close(): void;
}

/**
 * La conexión con la sala. Si se corta, vuelve a intentar sola y se presenta de nuevo con [hello]:
 * así un celular que perdió el Wi-Fi un segundo vuelve a su mismo auto.
 */
export function connect<M = FromRoom>(hello: () => object, onMessage: (message: M) => void, onLine: (up: boolean) => void): Link {
  const host = (window as unknown as { CarreraHost?: Bridge }).CarreraHost;
  return host ? overBridge(host, hello, onMessage, onLine) : overSocket(hello, onMessage, onLine);
}

/** Lo que el launcher le presta a la pared: está en el mismo equipo que la sala y no necesita la red. */
interface Bridge {
  open(): void;
  send(text: string): void;
  /** Los mensajes pendientes como una lista JSON, o `null` si el canal se cerró. */
  poll(): string | null;
  /** Cierra la pantalla de la carrera y vuelve al inicio del proyector. */
  exit?(): void;
}

function overBridge<M>(host: Bridge, hello: () => object, onMessage: (message: M) => void, onLine: (up: boolean) => void): Link {
  let up = false;
  const open = () => {
    host.open();
    host.send(JSON.stringify(hello()));
    up = true;
    onLine(true);
  };
  const timer = setInterval(() => {
    if (!up) return;
    const waiting = host.poll();
    if (waiting === null || waiting === undefined) {
      up = false;
      onLine(false);
      setTimeout(open, 500);
      return;
    }
    if (waiting === '[]') return;
    for (const message of JSON.parse(waiting) as M[]) onMessage(message);
  }, 12);
  // Diferido: quien llama recibe el enlace antes del primer onLine, como con el WebSocket.
  setTimeout(open, 0);
  return {
    send(message) {
      if (up) host.send(JSON.stringify(message));
    },
    close() {
      up = false;
      clearInterval(timer);
    },
  };
}

/** El código con que la sala cierra la conexión que otra reemplazó. */
const REPLACED = 4001;

function overSocket<M>(hello: () => object, onMessage: (message: M) => void, onLine: (up: boolean) => void): Link {
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
        onMessage(JSON.parse(String(event.data)) as M);
      } catch {
        // Un mensaje que no se entiende no tira la conexión.
      }
    };
    ws.onclose = (event) => {
      if (socket !== ws) return;
      socket = null;
      onLine(false);
      // El mismo volante se abrió en otro lado: volver a entrar solo sería pelearle el auto.
      if (event.code === REPLACED) return onMessage({ t: 'error', code: 'moved' } as M);
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
