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

### Initial setup 

`make initial-setup`

### Environment cleanup

To clean the environment run `make delete-cluster`

