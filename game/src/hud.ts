import logoUrl from '../../app/src/main/assets/remote/logo.svg';

export interface HudLook {
  track: string;
  laps: number;
  /** Si el tablero puede usar la cinta. Va una sola por pantalla: si la pista ya la usa, acá no. */
  cinta: boolean;
  players: { name: string; paint: number }[];
}

export interface HudState {
  /** Índices de jugador, del primero al último. */
  order: number[];
  /** Segundos detrás del líder, por jugador. */
  gap: number[];
  /** Tanque de nitro de cada jugador, de 0 a 1. */
  nitro: number[];
  lap: number;
  /** Segundos de carrera; negativo durante la cuenta regresiva. */
  clock: number;
  done: boolean;
}

function clockText(seconds: number): string {
  const t = Math.max(0, seconds), m = Math.floor(t / 60);
  return `${m}:${(t - m * 60).toFixed(2).padStart(5, '0')}`;
}

/**
 * El tablero de la pared, con las reglas del manual: el wordmark va en una cabecera lisa de carbón,
 * nunca suelto sobre la imagen; los datos van en mono y la cinta marca un solo dato, el líder.
 */
export function mountHud(look: HudLook): { update(state: HudState): void } {
  const hud = document.createElement('div');
  hud.id = 'hud';
  hud.innerHTML = `
    <header>
      <img src="${logoUrl}" alt="galfredev">
      <span class="tag">CARRERA · ${look.track.toUpperCase()}</span>
      <span class="tag lap">VUELTA <b></b></span>
      <strong class="time"></strong>
    </header>
    <ol>${look.players.map(() => '<li><span class="n"></span><i></i><b></b><span class="gap"></span><u><s></s></u></li>').join('')}</ol>
    <p class="count"></p>`;
  document.body.appendChild(hud);
  const time = hud.querySelector('.time')!, lap = hud.querySelector('.lap b')!, count = hud.querySelector<HTMLElement>('.count')!;
  const rows = [...hud.querySelectorAll('li')].map((li) => ({
    li, n: li.querySelector('.n')!, chip: li.querySelector<HTMLElement>('i')!, name: li.querySelector('b')!, gap: li.querySelector('.gap')!, tank: li.querySelector<HTMLElement>('s')!,
  }));
  let shown = '';
  return {
    update(state) {
      time.textContent = clockText(state.clock);
      lap.textContent = `${Math.min(look.laps, state.lap + 1)}/${look.laps}`;
      const text = state.done ? 'Final' : state.clock < 0 ? String(Math.ceil(-state.clock)) : state.clock < 1 ? 'Ya' : '';
      if (text !== shown) {
        shown = text;
        count.textContent = text;
        count.style.display = text ? 'block' : 'none';
      }
      state.order.forEach((player, place) => {
        const row = rows[place], who = look.players[player];
        row.li.className = place === 0 ? (look.cinta ? 'first cinta' : 'first') : '';
        row.n.textContent = String(place + 1);
        row.chip.style.background = `#${who.paint.toString(16).padStart(6, '0')}`;
        row.name.textContent = who.name;
        row.gap.textContent = place === 0 ? 'LÍDER' : `+${state.gap[player].toFixed(2)}`;
        row.tank.style.width = `${Math.round(state.nitro[player] * 100)}%`;
      });
    },
  };
}
