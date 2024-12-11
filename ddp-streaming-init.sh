# /bin/sh

# helm repo add kafka-ui https://provectus.github.io/kafka-ui-charts

kubectl create namespace strimzi-cluster-operator
helm install strimzi-cluster-operator oci://quay.io/strimzi-helm/strimzi-kafka-operator --set watchAnyNamespace="true"  --namespace strimzi-cluster-operator

# Installing Kafka Stack
kubectl create namespace ddp-kafka
rm helm/ddp-streaming/custom.yaml
helm template helm/ddp-streaming >> helm/ddp-streaming/custom.yaml
kubectl apply -f helm/ddp-streaming/custom.yaml -n ddp-kafka
helm install helm-release-name charts/kafka-ui --set existingConfigMap="kafka-ui-helm-values" --namespace ddp-kafka


