#!/bin/bash
set -e

echo "[SETUP] Initializing git repository (if needed)..."
git init 2>/dev/null || true

echo "[SETUP] Cleaning up old dependencies..."
rm -rf lib/openzeppelin-contracts lib/forge-std

echo "[SETUP] Installing forge-std..."
forge install foundry-rs/forge-std

echo "[SETUP] Installing OpenZeppelin contracts..."
forge install OpenZeppelin/openzeppelin-contracts

# Robust check for OpenZeppelin install (Ownable.sol is always present)
if [ ! -f lib/openzeppelin-contracts/contracts/access/Ownable.sol ]; then
  # Fallback: check for any .sol file in contracts/
  if ! ls lib/openzeppelin-contracts/contracts/**/*.sol 1> /dev/null 2>&1; then
    echo "[ERROR] OpenZeppelin contracts not installed correctly. Please check your internet connection and rerun this script." >&2
    exit 1
  fi
fi

# Check forge-std
if [ ! -f lib/forge-std/src/Script.sol ]; then
  echo "[ERROR] forge-std not installed correctly. Please check your internet connection and rerun this script." >&2
  exit 1
fi

echo "[SETUP] Building contracts..."
forge build

echo "[SETUP] Done! You can now run 'somnia-cli config', 'forge test', and 'somnia-cli deploy'."
