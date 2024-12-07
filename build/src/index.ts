import {
  dag,
  Container,
  object,
  func,
  Directory,
} from "@dagger.io/dagger";

import * as utils from "./utils";
import * as ddpCtrlPlane from "./ddp-ctrl-plane";

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

    return k3SContainer;
  }
}
