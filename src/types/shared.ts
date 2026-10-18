export interface ScriptSig {
  asm: string;
  hex: string;
}

export interface ScriptPubKey {
  asm: string;
  hex: string;
  type: string;
  reqSigs?: number;
  addresses?: string[];
}
