import { Client, Directory, Container } from "@dagger.io/dagger";

const REPOSITORY_BASE_PATH = "ddp-application/ddp-flink/sql-runner"
const REPOSITORY_BASE_NAME = "viniro/ddp-os-flink"
const REPOSITORY_TAG = "v0.0.1"

export async function publishSQLRunnerImage(dag: Client, directory: Directory): Promise<string> {
    const container = await buildSQLRunnerContainer(dag, directory);
    const imageName = `${REPOSITORY_BASE_NAME}-sql-runner:${REPOSITORY_TAG}`
    return container.publish(imageName);
}

export async function buildSQLRunnerContainer(dag: Client, directory: Directory): Promise<Container> {
    let filteredSource = directory.directory(REPOSITORY_BASE_PATH)
    const javaContainer = await buildMaven(dag, filteredSource)
    const jarFile = javaContainer.file("/app/target/sql-runner-1.0-SNAPSHOT.jar")
    const scriptsDir = filteredSource.directory("sql-scripts")

    const deployContainer = dag.container()
    .from("flink:1.18")
    .withFile("/opt/flink/usrlib/sql-runner.jar", jarFile)
    .withDirectory("/opt/flink/usrlib/sql-scripts", scriptsDir)

    return deployContainer;
}

export async function buildMaven(dag: Client, directory: Directory): Promise<Container> {
    const container = dag.container()
    .from("maven:3.8.8-eclipse-temurin-21")
    .withDirectory("/app", directory)
    .withWorkdir("/app")
    .withExec(["mvn", "-ntp", "clean", "install"])
    return container;
}

