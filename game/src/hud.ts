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

function clockText(seconds: number, digits: number): string {
  const t = Math.max(0, seconds), m = Math.floor(t / 60);
  return `${m}:${(t - m * 60).toFixed(digits).padStart(3 + digits, '0')}`;
}

/** Escribe en la página solo si el valor cambió: cada escritura le cuesta al proyector rehacer el tablero. */
function writer<T>(apply: (value: T) => void): (value: T) => void {
  let last: T | undefined;
  return (value) => {
    if (value === last) return;
    last = value;
    apply(value);
  };
}

/**
 * El tablero de la pared, con las reglas del manual: el wordmark va en una cabecera lisa de carbón,
 * nunca suelto sobre la imagen; los datos van en mono y la cinta marca un solo dato, el líder.
 */
export function mountHud(look: HudLook): { update(state: HudState): void; show(on: boolean): void } {
  document.getElementById('hud')?.remove();
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
  const rows = [...hud.querySelectorAll('li')].map((li) => {
    const n = li.querySelector('.n')!, chip = li.querySelector<HTMLElement>('i')!, name = li.querySelector('b')!, gap = li.querySelector('.gap')!, tank = li.querySelector<HTMLElement>('s')!;
    return {
      cls: writer<string>((v) => { li.className = v; }), n: writer<string>((v) => { n.textContent = v; }), chip: writer<number>((v) => { chip.style.background = `#${v.toString(16).padStart(6, '0')}`; }),
      name: writer<string>((v) => { name.textContent = v; }), gap: writer<string>((v) => { gap.textContent = v; }),
      // La barra se estira con una transformación, que no obliga a recalcular la disposición.
      tank: writer<number>((v) => { tank.style.transform = `scaleX(${v / 20})`; }),
    };
  });
  const writeTime = writer<string>((v) => { time.textContent = v; }), writeLap = writer<string>((v) => { lap.textContent = v; });
  let shown = '';
  return {
    show(on) {
      hud.style.display = on ? 'block' : 'none';
    },
    update(state) {
      // En carrera el reloj va en décimas: las centésimas obligaban a redibujar el tablero en cada cuadro.
      writeTime(clockText(state.clock, state.done ? 2 : 1));
      writeLap(`${Math.min(look.laps, state.lap + 1)}/${look.laps}`);
      const text = state.done ? 'Final' : state.clock < 0 ? String(Math.ceil(-state.clock)) : state.clock < 1 ? 'Ya' : '';
      if (text !== shown) {
        shown = text;
        count.textContent = text;
        count.style.display = text ? 'block' : 'none';
      }
      state.order.forEach((player, place) => {
        const row = rows[place], who = look.players[player];
        row.cls(place === 0 ? (look.cinta ? 'first cinta' : 'first') : '');
        row.n(String(place + 1));
        row.chip(who.paint);
        row.name(who.name);
        row.gap(place === 0 ? 'LÍDER' : `+${state.gap[player].toFixed(1)}`);
        row.tank(Math.round(state.nitro[player] * 20));
      });
    },
  };
}
