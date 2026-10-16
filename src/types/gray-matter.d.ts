declare module 'gray-matter' {
  export interface GrayMatterFile<T = Record<string, unknown>> {
    data: T;
    content: string;
    orig: string;
  }

  export default function matter<T = Record<string, unknown>>(
    input: string,
  ): GrayMatterFile<T>;
}
