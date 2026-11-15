import { connect, type Link } from '../net/link';
import type { Command, FromRoom, Mine, RosterEntry, Shared } from '../net/protocol';
import type { Input } from '../sim/race';

interface Handlers {
  roster(): void;
  command(from: number, command: Command): void;
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
  private readonly on: Handlers;

  constructor(secret: string, on: Handlers) {
    this.on = on;
    this.link = connect(() => ({ t: 'host', secret }), (message) => this.receive(message), (up) => {
      // Al volver la conexión, la sala manda de nuevo quién está; lo dicho a todos hay que repetirlo.
      if (up && this.lastShared) this.link.send({ t: 'all', d: JSON.parse(this.lastShared) });
    });
  }

  /** Quién elige pista y larga: el que entró primero entre los que siguen conectados. */
  get lead(): number | null {
    return this.seats.find((seat) => seat.on)?.id ?? null;
  }

  input(id: number): Input {
    let input = this.inputs.get(id);
    if (!input) this.inputs.set(id, (input = { steer: 0, brake: false, nitro: false }));
    return input;
  }

  /** Le cuenta a todos cómo está la sala, solo si cambió algo. */
  share(state: Shared): void {
    const text = JSON.stringify(state);
    if (text === this.lastShared) return;
    this.lastShared = text;
    this.link.send({ t: 'all', d: state });
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
    } else if (message.t === 'roster') {
      this.seats = message.players;
      // Quien se fue suelta el volante: su auto no sigue doblando para siempre.
      for (const seat of this.seats) if (!seat.on) this.inputs.delete(seat.id);
      this.on.roster();
    } else if (message.t === 'cmd') this.on.command(message.id, message.d);
  }
}
