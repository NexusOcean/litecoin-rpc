# Contributing

## Setup

Requires Node >= 24 and pnpm.

```bash
pnpm install
cp .env.example .env.test
```

Fill in `.env.test` with credentials for a Litecoin node you control (mainnet, testnet, or regtest). The test suite talks to a real node — some suites are skipped automatically if optional vars (`TEST_ADDRESS`, `TEST_IMPORT_ADDRESS`, `TEST_WALLET_PASSPHRASE`, `TEST_SPENT_TXID`/`TEST_SPENT_INDEX`) are left blank. `TEST_WALLET_PASSPHRASE` is only needed if the node's wallet is encrypted; tests that sign briefly unlock it and lock it again. Leave `LTC_TEST_SEND` unset unless you intend to broadcast real transactions from that node.

## Workflow

```bash
pnpm dev          # tsup --watch
pnpm lint          # eslint
pnpm typecheck     # tsc --noEmit
pnpm test          # jest, against .env.test
pnpm build         # tsup
```

A pre-commit hook (husky + lint-staged) runs prettier and eslint on staged files automatically.

## Pull requests

- Keep PRs focused — no unrelated formatting or refactor diffs bundled in.
- Add or update tests in `tests/` for behavior changes.
- Run `pnpm lint`, `pnpm typecheck`, `pnpm test`, and `pnpm build` before opening the PR; CI runs the same checks minus `test` (which needs a live node).
- Fill out the PR template, including how you tested the change.

## Reporting bugs / requesting features

Use the issue templates. For security vulnerabilities, see [SECURITY.md](SECURITY.md) instead of opening a public issue.
