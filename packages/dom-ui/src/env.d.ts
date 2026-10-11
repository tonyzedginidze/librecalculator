interface ImportMeta {
  readonly glob: <T = unknown>(
    pattern: string,
    options?: { eager?: boolean; import?: string },
  ) => Record<string, () => Promise<T>>;
}
