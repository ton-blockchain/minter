import useIsConnected from "hooks/useIsConnected";
import { Deployer } from "screens/deployer";
import Connect from "components/connect";
import { styled } from "@mui/styles";
import { Box } from "@mui/system";
import {
  ContractDeployer,
  TonConnection,
  TonhubProvider,
  ChromeExtensionWalletProvider,
} from "jetton-deployer-contracts";
import { json } from "stream/consumers";
import { JettonDeployController } from "jetton-deployer-contracts";
import { Address, toNano, TonClient } from "ton";
import { Environments, EnvProfiles } from "jetton-deployer-contracts";
import { useEffect } from "react";

const StyledApp = styled(Box)({
  maxWidth: "960px",
  width: "calc(100% - 50px)",
  marginLeft: "auto",
  marginRight: "auto",
  paddingTop: "40px",
  paddingBottom: "100px",
});

function App() {
  useIsConnected();

  return (
    <StyledApp>
      <button
        onClick={async () => {
          const tonHubCon = new TonConnection(
            new TonhubProvider({
              isSandbox: true,
              onSessionLinkReady: (session) => {
                // eslint-disable-next-line no-restricted-globals
                open(session.link);
              },
              persistenceProvider: localStorage,
            }),
            EnvProfiles[Environments.SANDBOX].rpcApi
          );
          const wallet = await tonHubCon.connect();

          const dep = new JettonDeployController();

          dep.createJetton(
            {
              amountToMint: toNano(100),
              jettonName: "TESXT",
              jettonSymbol: "TST",
              owner: Address.parse(wallet.address),
            },
            tonHubCon
          );
        }}
      >
        XXX
      </button>

      <button
        onClick={async () => {
          const tonHubCon = new TonConnection(
            new ChromeExtensionWalletProvider(),
            EnvProfiles[Environments.MAINNET].rpcApi
          );
          const wallet = await tonHubCon.connect();

          const dep = new JettonDeployController();

          dep.createJetton(
            {
              amountToMint: toNano(100),
              jettonName: "TEST",
              jettonSymbol: "TST",
              owner: Address.parse(wallet.address),
            },
            tonHubCon
          );
        }}
      >
        Chrome Ext
      </button>

      {/* <Navbar /> */}
      {/* <Deployer />
      <Connect /> */}
    </StyledApp>
  );
}

export default App;
