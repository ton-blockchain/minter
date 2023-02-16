import { TonClient } from "ton";
import { getHttpEndpoint } from "@orbs-network/ton-access";
import { getNetwork } from "./hooks/useNetwork";

const endpointP = getHttpEndpoint({
  network: getNetwork(new URLSearchParams(window.location.search)),
});

async function _getClient() {
  return new TonClient({
    endpoint: await endpointP,
  });
}

const clientP = _getClient();

export async function getClient() {
  return clientP;
}

export async function getEndpoint() {
  return endpointP;
}
