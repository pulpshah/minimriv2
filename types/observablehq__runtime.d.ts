declare module '@observablehq/runtime' {
    export class Runtime {
      module(
        define: any,
        observer?: (name: string) => any
      ): {
        value: (name: string) => Promise<any>;
      };
      dispose(): void;
    }
  
    export class Inspector {
      constructor(node: HTMLElement);
    }
  }
  