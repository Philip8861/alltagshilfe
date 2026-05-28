/** Kartenbild – muss mit `KartenMitKoordinatenErfassen` übereinstimmen. */
export const STANDORT_KARTE_BILD = {
  width: 1536,
  height: 1200,
  objectPositionX: -38,
  objectPositionY: 0,
} as const;

export type MapContentRect = {
  left: number;
  top: number;
  width: number;
  height: number;
};

/** Sichtbarer Bildbereich innerhalb des Karten-Containers (object-fit: contain + object-position). */
export function getMapContentRect(containerWidth: number, containerHeight: number): MapContentRect {
  const imgAspect = STANDORT_KARTE_BILD.width / STANDORT_KARTE_BILD.height;
  const containerAspect = containerWidth / containerHeight;

  let width: number;
  let height: number;

  if (containerAspect > imgAspect) {
    height = containerHeight;
    width = containerHeight * imgAspect;
  } else {
    width = containerWidth;
    height = containerWidth / imgAspect;
  }

  const left =
    (containerWidth - width) * (STANDORT_KARTE_BILD.objectPositionX / 100);
  const top =
    (containerHeight - height) * (STANDORT_KARTE_BILD.objectPositionY / 100);

  return { left, top, width, height };
}

export function roundMapCoord(n: number) {
  return Math.round(n * 10) / 10;
}

/** Gespeicherte Karten-%-Koordinaten → Container-%-Position für absolute Elemente. */
export function mapPercentToContainerPercent(
  left: number,
  top: number,
  containerWidth: number,
  containerHeight: number,
): { left: number; top: number } {
  const content = getMapContentRect(containerWidth, containerHeight);
  return {
    left: ((content.left + (left / 100) * content.width) / containerWidth) * 100,
    top: ((content.top + (top / 100) * content.height) / containerHeight) * 100,
  };
}

/** Mausposition / Container-%-Wert → gespeicherte Karten-%-Koordinaten. */
export function clientToMapPercent(
  clientX: number,
  clientY: number,
  containerRect: DOMRect,
): { left: number; top: number } {
  const content = getMapContentRect(containerRect.width, containerRect.height);
  const x = clientX - containerRect.left - content.left;
  const y = clientY - containerRect.top - content.top;
  return {
    left: roundMapCoord(Math.max(0, Math.min(100, (x / content.width) * 100))),
    top: roundMapCoord(Math.max(0, Math.min(100, (y / content.height) * 100))),
  };
}

export function containerPercentToMapPercent(
  containerLeft: number,
  containerTop: number,
  containerWidth: number,
  containerHeight: number,
): { left: number; top: number } {
  const content = getMapContentRect(containerWidth, containerHeight);
  const x = (containerLeft / 100) * containerWidth - content.left;
  const y = (containerTop / 100) * containerHeight - content.top;
  return {
    left: roundMapCoord(Math.max(0, Math.min(100, (x / content.width) * 100))),
    top: roundMapCoord(Math.max(0, Math.min(100, (y / content.height) * 100))),
  };
}
