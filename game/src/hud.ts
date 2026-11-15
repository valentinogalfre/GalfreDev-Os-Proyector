import logoUrl from '../../app/src/main/assets/remote/logo.svg';

export interface HudRow { name: string; paint: number; gap: number }
export interface HudLook {
  track: string;
  /** Si el tablero puede usar la cinta. Va una sola por pantalla: si la pista ya la usa, acá no. */
  cinta: boolean;
  rows: HudRow[];
}

function clock(seconds: number): string {
  const m = Math.floor(seconds / 60), s = seconds - m * 60;
  return `${m}:${s.toFixed(2).padStart(5, '0')}`;
}

/**
 * El tablero de la pared, con las reglas del manual: el wordmark va en una cabecera lisa de carbón,
 * nunca suelto sobre la imagen; los datos van en mono y la cinta marca un solo dato, el líder.
 */
export function mountHud(look: HudLook): { update(time: number): void } {
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.innerHTML = `
    <header>
      <img src="${logoUrl}" alt="galfredev">
      <span class="tag">CARRERA · ${look.track.toUpperCase()}</span>
      <span class="tag lap">VUELTA <b>2/3</b></span>
      <strong class="time"></strong>
    </header>
    <ol>${look.rows.map((row, i) => `
      <li class="${i === 0 ? (look.cinta ? 'first cinta' : 'first') : ''}">
        <span class="n">${i + 1}</span>
        <i style="background:#${row.paint.toString(16).padStart(6, '0')}"></i>
        <b>${row.name}</b>
        <span class="gap">${i === 0 ? 'LÍDER' : `+${row.gap.toFixed(2)}`}</span>
      </li>`).join('')}
    </ol>`;
  document.body.appendChild(hud);
  const time = hud.querySelector('.time')!;
  return { update: (t) => { time.textContent = clock(84.36 + t); } };
}
