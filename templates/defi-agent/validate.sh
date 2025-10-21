#!/bin/bash
set -e

# Preflight validation for Somnia agent template

# Check Foundry
if ! command -v forge &> /dev/null; then
  echo "[ERROR] Foundry (forge) is not installed. Install: https://book.getfoundry.sh/getting-started/installation" >&2
  exit 1
fi

# Check .env
if [ ! -f .env ]; then
  echo "[ERROR] .env file not found. Run 'somnia-cli config' first." >&2
  exit 1
fi

# Validate PRIVATE_KEY
key=$(grep '^PRIVATE_KEY=' .env | cut -d'=' -f2 | tr -d '\r\n ')
if [ -z "$key" ]; then
  echo "[ERROR] PRIVATE_KEY not set in .env." >&2
  exit 1
fi
if [[ "$key" =~ ^0x ]]; then
  key=${key:2}
fi
if ! [[ "$key" =~ ^[0-9a-fA-F]{64}$ ]]; then
  echo "[ERROR] PRIVATE_KEY must be 64 hex chars, no 0x, no whitespace." >&2
  exit 1
fi

# Check critical dependencies
if [ ! -f lib/openzeppelin-contracts/contracts/security/ReentrancyGuard.sol ]; then
  echo "[ERROR] OpenZeppelin contracts missing. Run 'bash setup.sh' again." >&2
  exit 1
fi
if [ ! -f lib/forge-std/src/Script.sol ]; then
  echo "[ERROR] forge-std missing. Run 'bash setup.sh' again." >&2
  exit 1
fi

echo "[VALIDATION] All checks passed. Ready to build, test, and deploy!"
