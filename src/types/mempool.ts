export interface MempoolInfo {
  loaded: boolean;
  size: number;
  bytes: number;
  usage: number;
  maxmempool: number;
  mempoolminfee: number;
  minrelaytxfee: number;
  unbroadcastcount: number;
}

export interface MempoolEntryFees {
  base: number;
  modified: number;
  ancestor: number;
  descendant: number;
}

export interface MempoolEntry {
  fees: MempoolEntryFees;
  vsize: number;
  weight: number;
  mwebweight: number;
  /** @deprecated use fees.base */
  fee: number;
  /** @deprecated use fees.modified */
  modifiedfee: number;
  time: number;
  height: number;
  descendantcount: number;
  descendantsize: number;
  descendantmwebweight: number;
  descendantfees: number;
  ancestorcount: number;
  ancestorsize: number;
  ancestormwebweight: number;
  ancestorfees: number;
  wtxid: string;
  depends: string[];
  spentby: string[];
  'bip125-replaceable': boolean;
  unbroadcast: boolean;
}

export type RawMempool = Record<string, MempoolEntry>;
