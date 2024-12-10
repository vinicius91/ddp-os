# /bin/sh

kubectl create namespace strimzi-cluster-operator

helm install strimzi-cluster-operator  \
--set watchAnyNamespace="true"  \
--set replicas=2 oci://quay.io/strimzi-helm/strimzi-kafka-operator \
--namespace strimzi-cluster-operator


kubectl create namespace ddp-kafka-cluster


kubectl apply -f local/kafka.yaml -n ddp-kafka-cluster

kubectl apply -f local/kafka-connect.yaml -n ddp-kafka-cluster

kubectl apply -f local/source-connector.yaml -n ddp-kafka-cluster

kubectl apply -f local/kafka-bridge.yaml -n ddp-kafka-cluster