// Ambient declaration for the `three` package.
//
// `@types/three` is not installable in the offline sandbox, so we declare the
// subset of symbols this project uses. Each class is typed `any`, which keeps
// constructors, instance properties, and static helpers all typechecking.
// If you start using more of three's API, add the symbol here to keep types.

declare module "three" {
  export class Scene { constructor(); background: any; add(...objs: any[]): void; traverse(cb: (obj: any) => void): void; rotateY?: any; rotateX?: any; }
  export class PerspectiveCamera {
    constructor(fov: number, aspect: number, near: number, far: number);
    position: any;
    aspect: number;
    updateProjectionMatrix(): void;
    lookAt(...args: any[]): void;
  }
  export class WebGLRenderer {
    constructor(params?: any);
    domElement: HTMLCanvasElement;
    setSize(w: number, h: number): void;
    setPixelRatio(r: number): void;
    toneMapping: number;
    toneMappingExposure: number;
    render(scene: any, camera: any): void;
    dispose(): void;
  }
  export class Group { constructor(); add(...objs: any[]): void; scale: any; rotation: any; position: any; }
  export class Mesh {
    constructor(geometry?: any, material?: any);
    geometry: any;
    material: any;
    position: any;
    rotation: any;
    userData: any;
    dispose?(): void;
  }
  export class Points {
    constructor(geometry: any, material: any);
    rotation: any;
    position: any;
  }
  export class SphereGeometry {
    constructor(radius: number, w: number, h: number);
    dispose(): void;
  }
  export class TorusGeometry {
    constructor(radius: number, tube: number, radialSeg: number, tubularSeg: number);
    dispose(): void;
  }
  export class BufferGeometry {
    setAttribute(name: string, attr: any): void;
    getAttribute(name: string): any;
    dispose(): void;
  }
  export class BufferAttribute {
    constructor(array: Float32Array | number[], itemSize: number);
    array: any;
    needsUpdate: boolean;
  }
  export class MeshBasicMaterial {
    constructor(params?: any);
    color: any;
    transparent: boolean;
    opacity: number;
    dispose(): void;
  }
  export class PointsMaterial {
    constructor(params?: any);
    color: any;
    map: any;
    transparent: boolean;
    opacity: number;
    size: number;
    blending: number;
    depthWrite: boolean;
    sizeAttenuation: boolean;
    dispose(): void;
  }
  export class PointLight {
    constructor(color?: any, intensity?: number, distance?: number, decay?: number);
    color: any;
    position: any;
  }
  export class AmbientLight { constructor(color?: any, intensity?: number); }
  export class DirectionalLight { constructor(color?: any, intensity?: number); position: any; }
  export class Color { constructor(color?: any); setHex(hex: number): void; r: number; g: number; b: number; }
  export class CanvasTexture {
    constructor(canvas: HTMLCanvasElement);
    dispose(): void;
  }
  export class Object3D {}
  export class Material { dispose(): void; }

  export const ACESFilmicToneMapping: number;
  export const AdditiveBlending: number;
}