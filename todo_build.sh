#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
TODO_APP_DIR="$ROOT_DIR/todo-app"

DOCKERFILES_DIR="$TODO_APP_DIR/docker/"
MANIFESTS_DIR="$TODO_APP_DIR/manifests"

PV_NAME="shared-pv"
TARGET_PVC="todo-claim"

BACKEND_IMAGE="todo-backend:latest"
FRONTEND_IMAGE="todo-frontend:latest"
K3D_CLUSTER="${K3D_CLUSTER:-k3s-default}"

echo "[1/6] Removing local Docker images: $BACKEND_IMAGE $FRONTEND_IMAGE"
docker image rm -f "$BACKEND_IMAGE $FRONTEND_IMAGE" 2>/dev/null || true

echo "[2/6] Building local Docker images: $BACKEND_IMAGE $FRONTEND_IMAGE"
docker build -t "$BACKEND_IMAGE" -f "$DOCKERFILES_DIR/backend.Dockerfile" "$TODO_APP_DIR"
docker build -t "$FRONTEND_IMAGE" -f "$DOCKERFILES_DIR/frontend.Dockerfile" "$TODO_APP_DIR"

echo "[3/6] Importing image into k3d cluster: $K3D_CLUSTER"
k3d image import "$BACKEND_IMAGE" "$FRONTEND_IMAGE" -c "$K3D_CLUSTER"

echo "[4/6] Deleting Kubernetes manifests from $MANIFESTS_DIR"
kubectl patch pvc "$TARGET_PVC" -p '{"metadata":{"finalizers":null}}' 2>/dev/null || true
kubectl delete -f "$MANIFESTS_DIR" --ignore-not-found=true

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

echo "[6/6] Applying Kubernetes manifests from $MANIFESTS_DIR"
kubectl apply -f "$MANIFESTS_DIR"

echo "Done"
