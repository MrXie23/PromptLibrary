declare module 'gray-matter' {
  interface GrayMatterResult<T = any> {
    data: T;
    content: string;
    excerpt?: string;
    orig: string;
    language: string;
    matter: string;
    stringify: (options?: any) => string;
  }

  interface GrayMatterOptions {
    excerpt?: boolean | ((file: any, options: any) => string);
    excerpt_separator?: string;
    engines?: Record<string, any>;
    language?: string;
    delimiters?: string | [string, string];
    [key: string]: any;
  }

  function matter<T = any>(
    content: string | Buffer,
    options?: GrayMatterOptions
  ): GrayMatterResult<T>;

  export = matter;
} 