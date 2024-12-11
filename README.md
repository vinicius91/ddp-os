# DDP OS

Am Open Source Declarative Data Platform

## Local K8s setup

Requirements:

- [Dagger](https://docs.dagger.io/install)
- [KinD](https://kind.sigs.k8s.io/docs/user/quick-start/#installation)
- [Helm](https://helm.sh/docs/intro/install/)

### Building the Kafka Connect image

`make publish-kafka-connect-img`

### Creating local KinD cluster

`make create-cluster`

### Installing the K8s dependencies

Kafka UI Helm Chart
`helm repo add kafka-ui https://provectus.github.io/kafka-ui-charts`

### Creating the K8s environment

First, create the required namespaces

`kubectl create namespace strimzi-cluster-operator`

`kubectl create namespace ddp-kafka`

Install the Strimzi operator

`helm install strimzi-cluster-operator oci://quay.io/strimzi-helm/strimzi-kafka-operator --set watchAnyNamespace="true"  --namespace strimzi-cluster-operator`

Update the custom values for the charts

`make update-helm-values`

Apply the updated values to the cluster

`make apply-helm`

Install the Kafka-UI

`make install-kafka-ui`

### Environment cleanup

To clean the environment run `make delete-cluster`

