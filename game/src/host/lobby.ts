import logoUrl from '../../../app/src/main/assets/remote/logo.svg';

export interface LobbyState {
  results: { name: string; paint: number; time: number | null }[] | null;
  track: string;
  laps: number;
  players: { name: string; paint: number; on: boolean }[];
  lead: string | null;
}

const hex = (color: number) => `#${color.toString(16).padStart(6, '0')}`;
const esc = (text: string) => text.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

/** El QR llega ya calculado por el launcher: lado, guion y los módulos en hexadecimal, fila por fila. */
function qrSvg(code: string): string {
  const [side, bits] = code.split('-'), n = Number(side);
  if (!n || !bits) return '';
  let path = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const i = y * n + x;
      if ((parseInt(bits[i >> 2], 16) >> (3 - (i & 3))) & 1) path += `M${x + 4} ${y + 4}h1v1h-1z`;
    }
  }
  // Carbón sobre hueso, con su margen: los colores de la marca y el contraste que un lector necesita.
  return `<svg viewBox="0 0 ${n + 8} ${n + 8}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#f1ede6"/><path d="${path}" fill="#111111"/></svg>`;
}

/**
 * La sala en la pared: a la izquierda el código para entrar, a la derecha quién está. Y la misma
 * lámina, al terminar, con cómo llegaron. La cinta marca una sola cosa: qué hacer ahora.
 */
export function mountLobby(qr: string): { show(state: LobbyState): void; hide(): void } {
  const panel = document.createElement('div');
  panel.id = 'lobby';
  document.body.appendChild(panel);
  const code = qrSvg(qr);
  let shown = '';
  return {
    show(state) {
      const done = state.results !== null;
      const rows = done
        ? state.results!.map((r, i) => `<li><span class="n">${i + 1}</span><i style="background:${hex(r.paint)}"></i><b>${esc(r.name)}</b><span class="gap">${r.time === null ? '—' : `${r.time.toFixed(2)} S`}</span></li>`)
        : state.players.map((p) => `<li class="${p.on ? '' : 'off'}"><span class="n"></span><i style="background:${hex(p.paint)}"></i><b>${esc(p.name)}</b><span class="gap">${p.on ? 'LISTO' : 'SIN SEÑAL'}</span></li>`);
      const html = `
        <header><img src="${logoUrl}" alt="galfredev"><span class="tag">CARRERA · ${esc(state.track.toUpperCase())} · ${state.laps} VUELTAS</span></header>
        <section class="join">
          <span class="tag">${done ? 'OTRA CARRERA' : 'PARA ENTRAR'}</span>
          <h1>${done ? 'Final' : 'Escaneá y corré'}</h1>
          ${code ? `<div class="qr">${code}</div><span class="tag">MISMA RED WI-FI QUE EL PROYECTOR</span>` : ''}
        </section>
        <section class="list">
          <span class="tag">${done ? 'LLEGADA' : `EN LA SALA · ${state.players.length}`}</span>
          <ol>${rows.join('') || '<li class="off"><span class="n"></span><i></i><b>Todavía no entró nadie</b><span class="gap"></span></li>'}</ol>
          <p class="next">${state.lead ? `${done ? 'Sigue' : 'Larga'} ${esc(state.lead)} desde su celular` : 'Con OK en el control larga una carrera de exhibición'}</p>
          <span class="tag">CONTROL · ◀ ▶ PISTA · OK LARGAR</span>
        </section>`;
      if (html !== shown) panel.innerHTML = shown = html;
      panel.style.display = 'grid';
    },
    hide() {
      panel.style.display = 'none';
    },
  };
}
