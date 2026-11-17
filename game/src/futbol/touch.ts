/**
 * El celular como control: sin zoom por doble toque ni pellizco, sin menú de mantener apretado y
 * con el alto real de la pantalla (en Safari y Chrome `100vh` incluye la barra de direcciones).
 */
export function holdStill(): void {
  const active: AddEventListenerOptions = { passive: false };
  const stop = (e: Event) => e.preventDefault();

  // Safari ignora user-scalable=no: el pellizco se frena acá.
  for (const type of ['gesturestart', 'gesturechange', 'gestureend']) document.addEventListener(type, stop, active);
  document.addEventListener('touchmove', (e) => {
    const scale = (e as TouchEvent & { scale?: number }).scale;
    if (e.touches.length > 1 || (scale !== undefined && scale !== 1)) e.preventDefault();
    else if (document.body.classList.contains('playing')) e.preventDefault();
  }, active);

  // Dos toques seguidos hacen zoom en Safari: el segundo se frena, y si era un botón igual cuenta.
  let last = 0;
  document.addEventListener('touchend', (e) => {
    const now = Date.now(), target = e.target as Element | null, quick = now - last < 350;
    last = now;
    if (!quick || e.touches.length > 0 || !target || !target.closest) return;
    if (target.closest('input, textarea, .kick, .zone')) return;
    e.preventDefault();
    const button = target.closest('button') as HTMLButtonElement | null;
    if (button && !button.disabled) button.click();
  }, active);
  document.addEventListener('dblclick', stop, active);
  document.addEventListener('contextmenu', stop);

  const fit = () => {
    const view = window.visualViewport;
    const w = Math.round(view ? view.width : window.innerWidth), h = Math.round(view ? view.height : window.innerHeight);
    const root = document.documentElement.style;
    root.setProperty('--w', `${w}px`);
    root.setProperty('--h', `${h}px`);
  };
  fit();
  window.addEventListener('resize', fit);
  window.addEventListener('orientationchange', () => setTimeout(fit, 250));
  if (window.visualViewport) window.visualViewport.addEventListener('resize', fit);
}

/** En Chrome para Android, pantalla completa con el primer toque: se va la barra y se puede acostar. */
export function goFull(): void {
  const root = document.documentElement as HTMLElement & { webkitRequestFullscreen?: () => void };
  const doc = document as Document & { webkitFullscreenElement?: Element | null };
  if (!root.requestFullscreen || !/Android/i.test(navigator.userAgent)) return;
  document.addEventListener('click', (e) => {
    const target = e.target as Element | null;
    if (doc.fullscreenElement || doc.webkitFullscreenElement || (target && target.closest && target.closest('input'))) return;
    root.requestFullscreen({ navigationUI: 'hide' } as FullscreenOptions).catch(() => undefined);
  }, true);
}
