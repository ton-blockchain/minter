import BN from "bn.js";
import { Address, Cell, contractAddress, StateInit } from "ton";
import { TonConnectUI } from "@tonconnect/ui-react";
import { Network } from "./network";
import {
  buildTransactionMessage,
  buildTransactionRequest,
  sendTransactionAndTrack,
  TransactionOutcome,
} from "./transaction";

interface ContractDeployDetails {
  deployer: Address;
  value: BN;
  code: Cell;
  data: Cell;
  message?: Cell;
  dryRun?: boolean;
}

export interface ContractDeployResult {
  address: Address;
  outcome?: TransactionOutcome;
}

export class ContractDeployer {
  addressForContract(params: ContractDeployDetails) {
    return contractAddress({
      workchain: 0,
      initialData: params.data,
      initialCode: params.code,
    });
  }

  async deployContract(
    params: ContractDeployDetails,
    tonConnection: TonConnectUI,
    network: Network,
  ): Promise<ContractDeployResult> {
    const _contractAddress = this.addressForContract(params);
    let cell = new Cell();
    new StateInit({ data: params.data, code: params.code }).writeTo(cell);
    let outcome: TransactionOutcome | undefined;
    if (!params.dryRun) {
      const tx = buildTransactionRequest(network, params.deployer, [
        buildTransactionMessage(_contractAddress, network, params.value.toString(), {
          stateInit: cell.toBoc().toString("base64"),
          payload: params.message?.toBoc().toString("base64"),
        }),
      ]);

      outcome = await sendTransactionAndTrack(tonConnection, network, tx, _contractAddress);
    }

    return { address: _contractAddress, outcome };
  }
}
