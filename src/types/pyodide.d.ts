export type PyodideApi = {
  setStdout: (o: { batched: (s: string) => void }) => void;
  setStderr: (o: { batched: (s: string) => void }) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  runPythonAsync: (code: string) => Promise<any>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  globals?: any;
};

declare global {
  interface Window {
    loadPyodide?: (opts: { indexURL: string }) => Promise<PyodideApi>;
    __pyodideInstance?: PyodideApi | null;
  }
}
