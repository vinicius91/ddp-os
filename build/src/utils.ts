import { Container, Client } from "@dagger.io/dagger";

export async function getK3sContainer(dag: Client): Promise<Container> {
  const k3S = dag.k3S("k3s");
  const k3sServer = await k3S.server().start();

  const endpoint = await k3sServer.endpoint({
    port: 80,
    scheme: "http",
  });

  return dag
    .container()
    .from("alpine/helm")
    .withExec(["apk", "add", "kubectl"])
    .withEnvVariable("KUBECONFIG", "/.kube/config")
    .withFile("/.kube/config", k3S.config())
    .withExec([
      "helm",
      "install",
      "--wait",
      "--debug",
      "nginx",
      "oci://registry-1.docker.io/bitnamicharts/nginx",
    ])
    .withExec(["curl", "-sS", endpoint]);
}
