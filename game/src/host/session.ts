import { connect, type Link } from '../net/link';
import type { Command, FromRoom, Mine, RosterEntry, Shared, Wish } from '../net/protocol';
import type { Input } from '../sim/race';

interface Handlers {
  roster(): void;
  command(from: number, command: Command | Wish): void;
}

/**
 * La pared dentro de la sala: sabe quién está sentado, guarda el último volante de cada uno y
 * habla con los celulares. Lo que significa cada cosa lo decide la carrera, no esto.
 */
export class Session {
  seats: RosterEntry[] = [];
  private readonly inputs = new Map<number, Input>();
  private readonly link: Link;
  private lastShared = '';
  /** A quién le pasaron el mando. Mientras siga conectado manda él; si no, vuelve a quien corresponde. */
  handed: number | null = null;
  private readonly on: Handlers;

  constructor(secret: string, on: Handlers) {
    this.on = on;
    this.link = connect(() => ({ t: 'host', secret }), (message) => this.receive(message), (up) => {
      // Al volver la conexión, la sala manda de nuevo quién está; lo dicho a todos hay que repetirlo.
      if (up && this.lastShared) this.link.send({ t: 'all', d: JSON.parse(this.lastShared) });
    });
  }

  /**
   * Quién elige pista y larga: a quien le pasaron el mando; si no, el celular del dueño del proyector; si no,
   * el que entró primero. Siempre entre los que siguen conectados.
   */
  get lead(): number | null {
    const on = this.seats.filter((seat) => seat.on);
    return (on.find((seat) => seat.id === this.handed) ?? on.find((seat) => seat.boss) ?? on[0])?.id ?? null;
  }

  /** Si puede manejar la sala: el que tiene el mando, y siempre el dueño del proyector. */
  rules(id: number): boolean {
    return id === this.lead || this.seats.some((seat) => seat.id === id && seat.on && seat.boss === true);
  }

  /** Saca a uno de la sala: su celular vuelve a la pantalla de entrada. */
  drop(id: number): void {
    this.link.send({ t: 'drop', id });
  }

  input(id: number): Input {
    let input = this.inputs.get(id);
    if (!input) this.inputs.set(id, (input = { steer: 0, brake: false, nitro: false, drift: false }));
    return input;
  }

  /** Le cuenta a todos cómo está la sala, solo si cambió algo. */
  share(state: Shared): void {
    const text = JSON.stringify(state);
    if (text === this.lastShared) return;
    this.lastShared = text;
    this.link.send({ t: 'all', d: state });
  }

  /** Un cuadro de la carrera, para todos los celulares. No se guarda ni se repite. */
  stream(frame: string): void {
    this.link.send({ t: 'st', d: frame });
  }

  tell(id: number, mine: Mine): void {
    this.link.send({ t: 'to', id, d: mine });
  }

  private receive(message: FromRoom): void {
    if (message.t === 'in') {
      const input = this.input(message.id);
      input.steer = message.s;
      input.brake = message.b;
      input.nitro = message.n;
      input.drift = message.k;
    } else if (message.t === 'roster') {
      this.seats = message.players;
      // Quien se fue suelta el volante: su auto no sigue doblando para siempre.
      for (const seat of this.seats) if (!seat.on) this.inputs.delete(seat.id);
      this.on.roster();
    } else if (message.t === 'cmd') this.on.command(message.id, message.d);
  }
}
