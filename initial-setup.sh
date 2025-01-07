#!/bin/sh

# Main script logic
echo "Creating namespaces for the cluster operator and the Kafka cluster"
kubectl create namespace strimzi-cluster-operator
kubectl create namespace ddp-kafka
echo "Namespaces created"

echo "Installing the Strimzi Kafka Operator"
helm install strimzi-cluster-operator oci://quay.io/strimzi-helm/strimzi-kafka-operator --set watchAnyNamespace="true" --namespace strimzi-cluster-operator
echo "Strimzi Kafka Operator installed"

helm install prometheus-cummunity prometheus-community/kube-prometheus-stack --namespace ddp-kafka

echo "Installing the Kafka cluster"
make update-helm-values
make apply-helm
echo "Kafka cluster installed"

echo "Awaiting the Kafka cluster to be ready before installing the Kafka UI"
sleep 20
kubectl wait --for=condition=Ready pods --all -n ddp-kafka --timeout=300s
echo "Kafka cluster is ready"

echo "Installing the Kafka UI"
make install-kafka-ui
echo "Kafka UI installed"
echo "Initial setup completed"
