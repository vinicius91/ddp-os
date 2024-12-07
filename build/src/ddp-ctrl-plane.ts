import { Client, Directory, Container } from "@dagger.io/dagger";

const REPOSITORY_BASE_PATH = "ddp-application/ddp-ctrl-plane"
const REPOSITORY_BASE_NAME = "viniro/ddp-os"
const REPOSITORY_TAG = "v0.0.1"
const CTRL_PLANE_PREFIX = "ctrl-plane"

interface CtrlPlaneImages {
    go: string;
    frontend: string;
}

export async function buildDDPCtrlPlane(dag: Client, directory: Directory): Promise<CtrlPlaneImages> {
    const goImage = await publishGoImage(dag, directory);
    const frontendImage = await publishFrontendImage(dag, directory);
    return {
        go: goImage,
        frontend: frontendImage
    };
}


async function publishGoImage(dag: Client, directory: Directory): Promise<string> {
    let filteredSource = directory.directory(`${REPOSITORY_BASE_PATH}/`)
    
    const buildContainer = dag.container()
    .from("golang:1.23-alpine")
    .withDirectory("/src", filteredSource)
    .withWorkdir("/src")
    .withExec(["go", "mod", "download"])
    .withExec(["go", "build", "-o", "main", "cmd/api/main.go"])

    const prodContainer = dag.container()
    .from("alpine:3.20.1")
    .withWorkdir("/app")
    .withFile("/app/main", buildContainer.file("/src/main"))
    .withExposedPort(8080)
    .withEntrypoint(["./main"])

    const imageName = `${REPOSITORY_BASE_NAME}-${CTRL_PLANE_PREFIX}-go:${REPOSITORY_TAG}`

    return prodContainer.publish(imageName);
}

async function publishFrontendImage(dag: Client, directory: Directory): Promise<string> {
    let filteredSource = directory.directory(`${REPOSITORY_BASE_PATH}/frontend/`)
    
    const buildContainer = dag.container()
    .from("node:20")
    .withDirectory("/src", filteredSource, {
        exclude: ["node_modules", "dist"]
    })
    .withWorkdir("/src")
    .withExec(["npm", "install"])
    .withExec(["npm", "run", "build"])

    const prodContainer = dag.container()
    .from("node:23-slim")
    .withExec(["npm", "install", "-g", "serve"])
    .withDirectory("/app/dist", buildContainer.directory("/src/dist"))
    .withWorkdir("/app")
    .withExposedPort(5173)
    .withEntrypoint(["serve", "-s", "dist", "-l", "5173"])

    const imageName = `${REPOSITORY_BASE_NAME}-${CTRL_PLANE_PREFIX}-frontend:${REPOSITORY_TAG}`

    return prodContainer.publish(imageName);
}





// cp /src/ddp-ctrl-plane/frontend/package*.json .