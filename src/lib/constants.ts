import * as THREE from 'three';

export const COLORS = {
  black: '#0A0A0A',
  gold: '#C9A84C',
  warmLight: '#FFD699',
  white: '#FFFFFF',
};

export const PAINTING_WIDTH = 42;
export const PAINTING_HEIGHT = 18;

export function paintingToWorld(xPct: number, yPct: number, zOffset = 0.1): [number, number, number] {
  return [
    (xPct - 0.5) * PAINTING_WIDTH,
    (0.5 - yPct) * PAINTING_HEIGHT,
    zOffset,
  ];
}

export interface MonumentDef {
  id: string;
  label: string;
  buildingName: string;
  pos: { x: number; y: number };
  hitboxSize: [number, number];
  approachDuration: number;
  fovTarget: number;
  spaceTitle: string;
  spaceSurtitle: string;
  spaceSubtitle: string;
  spaceBody: string;
  spaceTotem: string;
  spaceConnector: string;
  spaceExtra?: string;
  spaceCategories?: string[];
  spaceEmail?: string;
  spaceFooter?: string[];
}

export const MONUMENTS: Record<string, MonumentDef> = {
  louvre: {
    id: 'louvre',
    label: "L'Institution",
    buildingName: 'Pyramide du Louvre',
    pos: { x: 0.48, y: 0.72 },
    hitboxSize: [5, 4],
    approachDuration: 6,
    fovTarget: 34,
    spaceTitle: "L'INSTITUTION",
    spaceSurtitle: 'I',
    spaceSubtitle: 'Le Prix',
    spaceTotem: 'TEMPS',
    spaceConnector: 'ACTE FONDATEUR',
    spaceBody: "Quand la création contemporaine s'inscrit dans le temps long.\n\nLes Prix des Arts et de la Culture offrent un cadre institutionnel exigeant et pérenne, dédié à la reconnaissance des œuvres, des parcours et des figures dont l'influence marque durablement notre époque.\n\nUn espace de dialogue entre création, transmission et temps long.",
    spaceFooter: ['Paris — Novembre 2026'],
  },
  institut: {
    id: 'institut',
    label: 'La Consécration',
    buildingName: 'Institut de France',
    pos: { x: 0.28, y: 0.48 },
    hitboxSize: [4, 3.5],
    approachDuration: 5,
    fovTarget: 35,
    spaceTitle: 'LA CONSÉCRATION',
    spaceSurtitle: 'II',
    spaceSubtitle: 'Distinctions',
    spaceTotem: 'AURA',
    spaceConnector: 'EXCELLENCE',
    spaceBody: "Reconnaître les œuvres et les parcours qui façonnent durablement le paysage culturel contemporain.\n\nAffirmer la légitimité de figures dont l'influence dépasse leur discipline d'origine.\n\nContribuer à la transmission d'une mémoire culturelle vivante, inscrite dans le temps long.",
  },
  opera: {
    id: 'opera',
    label: 'La Traversée',
    buildingName: 'Opéra Garnier',
    pos: { x: 0.78, y: 0.42 },
    hitboxSize: [4, 3.5],
    approachDuration: 5.5,
    fovTarget: 35,
    spaceTitle: 'LA TRAVERSÉE',
    spaceSurtitle: 'III',
    spaceSubtitle: 'Mémoire',
    spaceTotem: 'SILLAGE',
    spaceConnector: 'ARCHIVES VISUELLES',
    spaceBody: "D'une intimité partagée à une résonance publique.\n\nLa métamorphose d'un cercle en une scène ouverte sur le monde, tissée de rencontres décisives et de dialogues silencieux.",
  },
  grandPalais: {
    id: 'grandPalais',
    label: "L'Empreinte",
    buildingName: 'Grand Palais',
    pos: { x: 0.55, y: 0.35 },
    hitboxSize: [5, 3],
    approachDuration: 5,
    fovTarget: 36,
    spaceTitle: "L'EMPREINTE",
    spaceSurtitle: 'IV',
    spaceSubtitle: 'Héritage',
    spaceTotem: 'MÉMOIRE',
    spaceConnector: 'AD VITAM',
    spaceBody: "La responsabilité de la mémoire, c'est bâtir pour l'invisible et le lointain.\n\nS'associer aux Prix des Arts et de la Culture, c'est inscrire son action dans une démarche de transmission, de rayonnement culturel international et de responsabilité patrimoniale.\n\nUn engagement fondé sur le sens, la légitimité et le temps long.",
    spaceEmail: 'bureau@prixdesarts.org',
  },
};

export const MONUMENT_ORDER = ['louvre', 'institut', 'opera', 'grandPalais'];

export const SEINE_LIGHTS: Array<{ x: number; y: number }> = [
  // Upper Seine near Institut
  { x: 0.20, y: 0.44 },
  { x: 0.26, y: 0.47 },
  // Pont des Arts / Pont Neuf
  { x: 0.32, y: 0.51 },
  { x: 0.36, y: 0.54 },
  // Central bridges
  { x: 0.41, y: 0.57 },
  { x: 0.46, y: 0.60 },
  // Near Louvre (center spark)
  { x: 0.50, y: 0.63 },
  // Lower Seine
  { x: 0.54, y: 0.61 },
  { x: 0.59, y: 0.58 },
  { x: 0.64, y: 0.55 },
];

export function createGlowTexture(): THREE.CanvasTexture {
  const size = 64;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
  gradient.addColorStop(0.3, 'rgba(255, 255, 255, 0.4)');
  gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  return new THREE.CanvasTexture(canvas);
}
