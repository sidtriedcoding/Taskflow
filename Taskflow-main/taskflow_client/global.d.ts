declare module 'react' {
  const React: any;
  export = React;
  export as namespace React;
}

declare module 'lucide-react' {
  export const EllipsisVertical: any;
  export const Plus: any;
  export const Clock: any;
  export const Filter: any;
  export const Grid3x3: any;
  export const List: any;
  export const Share2: any;
  export const Table: any;
}

// D3 type declarations
declare module 'd3-array' {
  export const extent: any;
  export const max: any;
  export const min: any;
}

declare module 'd3-color' {
  export const color: any;
  export const rgb: any;
}

declare module 'd3-ease' {
  export const easeLinear: any;
}

declare module 'd3-interpolate' {
  export const interpolate: any;
}

declare module 'd3-path' {
  export const path: any;
}

declare module 'd3-scale' {
  export const scaleLinear: any;
  export const scaleBand: any;
}

declare module 'd3-shape' {
  export const line: any;
  export const area: any;
}

declare module 'd3-time' {
  export const timeFormat: any;
}

declare module 'd3-timer' {
  export const timer: any;
}

// Other library declarations
declare module 'estree' {
  export interface Node {
    type: string;
  }
}

declare module 'json-schema' {
  export interface JSONSchema7 {
    [key: string]: any;
  }
}

declare module 'use-sync-external-store' {
  export const useSyncExternalStore: any;
}

declare module 'uuid' {
  export function v4(): string;
  export function v1(): string;
}