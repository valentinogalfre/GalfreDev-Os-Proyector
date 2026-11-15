import * as THREE from 'three';
import type { CarStyle } from '../world/car';
import type { Track } from '../world/track';

export interface Stage {
  scene: THREE.Scene;
  track: Track;
  anisotropy: number;
}

export interface World {
  /** La escena chica de la que salen los reflejos de la pintura. */
  env: THREE.Scene;
  /** La luz que proyecta sombras, si el mundo tiene una. */
  sun?: THREE.DirectionalLight;
  /** Medio lado, en metros, de la zona con sombras alrededor del pelotón. */
  shadowRange?: number;
}

export interface Theme {
  name: string;
  cars: CarStyle[];
  /** Exposición del tono final. */
  exposure: number;
  /** El trazado: puntos (x, y, z) por los que pasa el eje de la pista. */
  layout: [number, number, number][];
  /** Medio ancho de la pista. */
  half: number;
  /** Dónde arranca la toma de muestra, en metros desde la largada. */
  start: number;
  /** Resplandor: fuerza, radio y umbral. */
  bloom: [number, number, number];
  /** De noche los autos alumbran el asfalto. */
  night?: boolean;
  build(stage: Stage): World;
  /** Marca al que va primero. */
  leader?(car: THREE.Group): void;
  /** Color de la estela que deja el que va primero. */
  trail?: number;
}
