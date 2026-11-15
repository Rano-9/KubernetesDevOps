#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOG_OUTPUT_DIR="$ROOT_DIR/log-output"
PING_PONG_DIR="$ROOT_DIR/ping-pong-app"
LOG_MANIFESTS_DIR="$LOG_OUTPUT_DIR/manifests"
PONG_MANIFESTS_DIR="$PING_PONG_DIR/manifests"
PV_NAME="shared-pv"
TARGET_PVC="log-claim"
K3D_CLUSTER="${K3D_CLUSTER:-k3s-default}"

echo "[1/6] Removing local Docker images"
docker image rm -f logger-server:latest logger-timestamp:latest ping-pong-app:latest 2>/dev/null || true

echo "[2/6] Building local Docker images"
docker build -t logger-server:latest -f "$LOG_OUTPUT_DIR/Dockerfile.server" "$LOG_OUTPUT_DIR"
docker build -t logger-timestamp:latest -f "$LOG_OUTPUT_DIR/Dockerfile.timestamp" "$LOG_OUTPUT_DIR"
docker build -t ping-pong-app:latest -f "$PING_PONG_DIR/Dockerfile" "$PING_PONG_DIR"

echo "[3/6] Importing images into k3d cluster: $K3D_CLUSTER"
k3d image import logger-server:latest logger-timestamp:latest ping-pong-app:latest -c "$K3D_CLUSTER"

echo "[4/6] Deleting Kubernetes manifests from $LOG_MANIFESTS_DIR and $PONG_MANIFESTS_DIR"
kubectl patch pvc "$TARGET_PVC" -p '{"metadata":{"finalizers":null}}' 2>/dev/null || true
kubectl delete -f "$LOG_MANIFESTS_DIR" --ignore-not-found=true
kubectl delete -f "$PONG_MANIFESTS_DIR" --ignore-not-found=true

echo "[5/6] Releasing PVC binding from PV: $PV_NAME"
echo "Deleting non-target PVCs (keeping: $TARGET_PVC)"
mapfile -t pvc_names < <(kubectl get pvc --request-timeout='10s' -o jsonpath='{range .items[*]}{.metadata.name}{"\n"}{end}' 2>/dev/null || true)
for pvc_name in "${pvc_names[@]}"; do
	[[ -z "$pvc_name" ]] && continue
	if [[ "$pvc_name" != "$TARGET_PVC" ]]; then
		kubectl delete pvc "$pvc_name" --ignore-not-found=true --wait=false
        kubectl patch pvc "$pvc_name" -p '{"metadata":{"finalizers":null}}'
	fi
done

if kubectl get pv "$PV_NAME" >/dev/null 2>&1; then
	kubectl patch pv "$PV_NAME" --type merge -p '{"spec":{"claimRef":null}}'
else
	echo "PersistentVolume $PV_NAME not found, skipping patch"
fi

echo "[6/6] Applying Kubernetes manifests from $LOG_MANIFESTS_DIR and $PONG_MANIFESTS_DIR"
kubectl apply -f "$LOG_MANIFESTS_DIR"
kubectl apply -f "$PONG_MANIFESTS_DIR"

echo "Done"