import { Client, Directory, Container } from "@dagger.io/dagger";

const REPOSITORY_BASE_PATH = "ddp-application/ddp-kafka/kafka-connect"
const REPOSITORY_BASE_NAME = "viniro/ddp-os-kafka"
const REPOSITORY_TAG = "v0.0.1"


export async function publishKafkaConnectImage(dag: Client, directory: Directory): Promise<string> {
    const container = await buildKafkaConnectImage(dag, directory);
    return await container.publish(`${REPOSITORY_BASE_NAME}-kafka-connect:${REPOSITORY_TAG}`);
}


export async function buildKafkaConnectImage(dag: Client, directory: Directory): Promise<Container> {
    let filteredSource = directory.directory(`${REPOSITORY_BASE_PATH}/plugins/`)
    const deployContainer = dag.container()
    .from("quay.io/strimzi/kafka:0.44.0-kafka-3.8.0")
    .withDirectory("/opt/kafka/plugins/", filteredSource)

    return deployContainer;
}