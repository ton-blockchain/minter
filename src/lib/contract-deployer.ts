import BN from "bn.js";
import { Address, beginCell, Cell, contractAddress, StateInit } from "ton";
import { SendTransactionRequest, TonConnectUI } from "@tonconnect/ui-react";

interface ContractDeployDetails {
  deployer: Address;
  value: BN;
  code: Cell;
  data: Cell;
  message?: Cell;
  dryRun?: boolean;
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
  ): Promise<Address> {
    const _contractAddress = this.addressForContract(params);
    let cell = new Cell();
    new StateInit({ data: params.data, code: params.code }).writeTo(cell);
    if (!params.dryRun) {
      const tx: SendTransactionRequest = {
        validUntil: Date.now() + 5 * 60 * 1000,
        messages: [
          {
            address: _contractAddress.toString(),
            amount: params.value.toString(),
            stateInit: cell.toBoc().toString("base64"),
            payload: params.message?.toBoc().toString("base64"),
          },
        ],
      };

      await tonConnection.sendTransaction(tx);
    }

    return _contractAddress;
  }
}
