# /bin/sh

kubectl create namespace strimzi-cluster-operator

helm install strimzi-cluster-operator oci://quay.io/strimzi-helm/strimzi-kafka-operator --set watchAnyNamespace="true"  --namespace strimzi-cluster-operator


kubectl create namespace ddp-kafka

kubectl apply -f custom.yaml -n ddp-kafka


kubectl apply -f local/kafka.yaml -n ddp-kafka-cluster

kubectl apply -f local/kafka-connect.yaml -n ddp-kafka-cluster

kubectl apply -f local/source-connector.yaml -n ddp-kafka-cluster

kubectl apply -f local/kafka-bridge.yaml -n ddp-kafka-cluster


helm pull oci://quay.io/strimzi-helm/strimzi-kafka-operator -d charts/

helm pull oci://registry-1.docker.io/bitnamicharts/redis -d charts/ --untar

helm pull oci://registry-1.docker.io/bitnamicharts/postgresql -d charts/ --untar