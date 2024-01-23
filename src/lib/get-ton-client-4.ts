import { TonClient4 } from "ton";
import { getHttpV4Endpoint } from "@orbs-network/ton-access";
import { getNetwork } from "./hooks/useNetwork";

const endpointP = getHttpV4Endpoint({
  network: getNetwork(new URLSearchParams(window.location.search)),
});

async function _getClient() {
  return new TonClient4({
    endpoint: await endpointP,
  });
}

const clientP = _getClient();

export async function getClient4() {
  return clientP;
}

export async function getEndpoint4() {
  return endpointP;
}
