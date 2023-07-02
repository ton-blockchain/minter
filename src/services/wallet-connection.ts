import { Address } from "ton";
class WalletConnection {
  public static isContractDeployed(contractAddr: Address) {
    return false; // TODO fix
    // return this.connection?._tonClient.isContractDeployed(contractAddr);
  }
}

export default WalletConnection;
