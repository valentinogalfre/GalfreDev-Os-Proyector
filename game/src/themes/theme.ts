import * as THREE from 'three';
import type { Grade } from '../render/fx';
import type { CarStyle } from '../world/car';
import type { MirrorLook } from '../world/mirror';
import type { Track } from '../world/track';

export interface Stage {
  scene: THREE.Scene;
  track: Track;
  anisotropy: number;
}

export interface World {
  /** La luz que proyecta sombras, si el mundo tiene una. */
  sun?: THREE.DirectionalLight;
  /** Medio lado, en metros, de la zona con sombras alrededor del pelotón. */
  shadowRange?: number;
  /** La malla de la que salen los rayos del sol. */
  rays?: THREE.Mesh;
  /** Pisos que espejan: geometría plana en y = 0, a qué altura va y cómo refleja. */
  mirrors?: { flat: THREE.BufferGeometry; y: number; look: Omit<MirrorLook, 'fog'> }[];
}

/** Lo que levantan las ruedas: polvo, agua. */
export interface Spray { color: number; opacity: number; size: number; additive: boolean }

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
  grade: Grade;
  /** De noche los autos alumbran el asfalto. */
  night?: boolean;
  spray?: Spray;
  /** Color de la estela que deja el que va primero. Es la cinta: si está, el tablero no la repite. */
  trail?: number;
  build(stage: Stage): World;
}
