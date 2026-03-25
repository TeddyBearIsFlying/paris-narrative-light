export const COLORS = {
  black: '#0A0A0A',
  gold: '#C9A84C',
  warmLight: '#FFD699',
  white: '#FFFFFF',
};

export interface MonumentDef {
  id: string;
  label: string;
  buildingName: string;
  /** Position as % of viewport */
  pos: { x: number; y: number };
  approachDuration: number;
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
    pos: { x: 57, y: 68 },
    approachDuration: 6,
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
    pos: { x: 19, y: 49 },
    approachDuration: 5,
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
    pos: { x: 44, y: 41 },
    approachDuration: 5.5,
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
    pos: { x: 83, y: 42 },
    approachDuration: 5,
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
