#!/bin/bash# !/bin/bash

set -e# set -e



echo "[SETUP] Initializing git repository (if needed)..."echo "[SETUP] Initializing git repository (if needed)..."

git init 2>/dev/null || truegit init 2>/dev/null || true



echo "[SETUP] Cleaning up old dependencies..."echo "[SETUP] Cleaning up old dependencies..."

rm -rf lib/openzeppelin-contracts lib/forge-stdrm -rf lib/openzeppelin-contracts lib/forge-std



echo "[SETUP] Installing forge-std..."echo "[SETUP] Installing forge-std..."

forge install foundry-rs/forge-stdforge install foundry-rs/forge-std



echo "[SETUP] Installing OpenZeppelin contracts..."echo "[SETUP] Installing OpenZeppelin contracts..."

forge install OpenZeppelin/openzeppelin-contractsforge install OpenZeppelin/openzeppelin-contracts



# Robust check for OpenZeppelin install (Ownable.sol is always present)# Robust check for OpenZeppelin install (Ownable.sol is always present)

if [ ! -f lib/openzeppelin-contracts/contracts/access/Ownable.sol ]; thenif [ ! -f lib/openzeppelin-contracts/contracts/access/Ownable.sol ]; then

  # Fallback: check for any .sol file in contracts/  # Fallback: check for any .sol file in contracts/

  if ! ls lib/openzeppelin-contracts/contracts/**/*.sol 1> /dev/null 2>&1; then  if ! ls lib/openzeppelin-contracts/contracts/**/*.sol 1> /dev/null 2>&1; then

    echo "[ERROR] OpenZeppelin contracts not installed correctly. Please check your internet connection and rerun this script." >&2    echo "[ERROR] OpenZeppelin contracts not installed correctly. Please check your internet connection and rerun this script." >&2

    exit 1    exit 1

  fi  fi

fifi

# Check forge-std# Check forge-std

if [ ! -f lib/forge-std/src/Script.sol ]; thenif [ ! -f lib/forge-std/src/Script.sol ]; then

  echo "[ERROR] forge-std not installed correctly. Please check your internet connection and rerun this script." >&2  echo "[ERROR] forge-std not installed correctly. Please check your internet connection and rerun this script." >&2

  exit 1  exit 1

fifi



echo "[SETUP] Building contracts..."echo "[SETUP] Building contracts..."

forge buildforge build



echo "[SETUP] Done! You can now run 'somnia-cli config', 'forge test', and 'somnia-cli deploy'."echo "[SETUP] Done! You can now run 'somnia-cli config', 'forge test', and 'somnia-cli deploy'."

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
