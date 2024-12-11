import {
  dag,
  Container,
  object,
  func,
  Directory,
  K3S,
} from "@dagger.io/dagger";

import * as utils from "./utils";
import * as ddpCtrlPlane from "./ddp-ctrl-plane";
import * as ddpFlink from "./ddp-flink-sql-runner";
import * as ddpKafka from "./ddp-kafka";

@object()
export class DdpOs {
  /**
   * Returns a container with the local K8s cluster running and the Nginx chart installed
   */
  @func()
  async buildLocal(source: Directory): Promise<Container> {
    const k3SContainer = await utils.getK3sContainer(dag);
    const ctrkPlaneImages = await ddpCtrlPlane.buildDDPCtrlPlane(dag, source);
    console.debug("Ctrl Plane Images: ", ctrkPlaneImages);

    const flinkImage = await ddpFlink.publishSQLRunnerImage(dag, source);
    console.debug("Flink Image: ", flinkImage);

    return k3SContainer;
  }

  /**
   * Returns a given container to be used for testing - SQL Runner
   */
  @func()
  async testLocal(source: Directory): Promise<Container> {
    return await ddpFlink.buildSQLRunnerContainer(dag, source);
  }

  /**
   * Returns the test K3s environment
   */
  @func()
  async testK3sEnv(source: Directory): Promise<Container> {
    const k3SContainer = await utils.getK3sContainer(dag);
    const filteredSource = source.directory("ddp-application/ddp-kafka");
    return k3SContainer
      .withExec([
        "helm",
        "install",
        "--wait",
        "--debug",
        "strimzi-cluster-operator",
        "oci://quay.io/strimzi-helm/strimzi-kafka-operator",
      ])
      .withDirectory("/apps", filteredSource);
  }

  /**
   * Publishes the Kafka Connect image
   */
  @func()
  async publishKafkaConnectImage(source: Directory): Promise<string> {
    return ddpKafka.publishKafkaConnectImage(dag, source);
  }
}
