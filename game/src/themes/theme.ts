import * as THREE from 'three';
import type { CarStyle } from '../world/car';
import type { Track } from '../world/track';

export interface Stage {
  scene: THREE.Scene;
  track: Track;
  anisotropy: number;
}

export interface Theme {
  name: string;
  cars: CarStyle[];
  /** Exposición del tono final. */
  exposure: number;
  /** Arma el mundo y devuelve la escena chica de la que salen los reflejos de la pintura. */
  build(stage: Stage): THREE.Scene;
  /** Marca al que va primero. */
  leader?(car: THREE.Group): void;
  /** Color de la estela que deja el que va primero. */
  trail?: number;
}
