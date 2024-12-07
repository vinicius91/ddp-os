# Variables for container registry and user
CONTAINER_REGISTRY ?= $(shell echo $$CONTAINER_REGISTRY)
CONTAINER_REGISTRY_USER ?= $(shell echo $$CONTAINER_REGISTRY_USER)

VERSION_TAG ?= v0.0.1

# Kind cluster configuration
define KIND_CLUSTER_CONFIG
kind: Cluster
apiVersion: kind.x-k8s.io/v1alpha4
nodes:
- role: control-plane
  kubeadmConfigPatches:
  - |
    kind: InitConfiguration
    nodeRegistration:
      kubeletExtraArgs:
        node-labels: "ingress-ready=true"
  extraPortMappings:
  - containerPort: 80
    hostPort: 80
    protocol: TCP
  - containerPort: 443
    hostPort: 443
    protocol: TCP
- role: worker
- role: worker
- role: worker
endef

export KIND_CLUSTER_CONFIG

.PHONY: create-cluster delete-cluster build-local

build-local:
	@echo "Building local using Dagger" && \
	dagger call build-local --source=.

create-cluster:
	@echo "Creating Kubernetes cluster with kind..." && \
	echo "$$KIND_CLUSTER_CONFIG" > kind-config.yaml && \
	kind create cluster --name dev --config=kind-config.yaml && \
	rm kind-config.yaml

delete-cluster:
	@echo "Deleting Kubernetes cluster with kind..." && \
	kind delete cluster --name dev

# Clean target (optional, add clean steps as necessary)
clean:
	@echo "Cleaning up..."
