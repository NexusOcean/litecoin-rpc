# Changelog

## [Unreleased]

### Added

- Named wallet support. `client.wallet(name)` returns the wallet methods
  scoped to that wallet, sending requests to `/wallet/<name>`. Required when
  more than one wallet is loaded; with a single wallet the unscoped methods
  keep working as before.
- `wallet` option on `CallOptions`, so `call()` and `batch()` can target a
  named wallet.
- Wallet methods: `createWallet`, `getBalances`,
  `signRawTransactionWithWallet`.
- Raw transaction method: `signRawTransactionWithKey`.
- Util methods: `getDescriptorInfo`, `deriveAddresses`.
- Types: `CreateWalletResult`, `Balances`, `BalanceGroup`, `DescriptorInfo`.
- `ImportMultiRequest` accepts descriptor imports (`desc`, `range`) and
  `keypool`; `ImportMultiResult` includes `warnings`.
- `PrevTx` accepts `amount` (required for segwit inputs) and `witnessScript`.
- `WalletInfo` includes `walletname`.

### Changed

- `ImportMultiRequest.scriptPubKey` is now optional, since a request may use
  `desc` instead.

### Removed

- `signRawTransaction`. The `signrawtransaction` RPC was removed in Litecoin
  Core 0.18. Use `signRawTransactionWithWallet` or `signRawTransactionWithKey`.
