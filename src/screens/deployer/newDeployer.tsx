import { useRef, useState } from "react";
import {
  List,
  ListItemText,
  ListItem,
  Card,
  CardContent,
} from "@mui/material";
import {  useForm } from "react-hook-form";

import {
  JettonDeployState,
  JettonDeployController,
  EnvProfiles,
  Environments,
  ContractDeployer,
  IPFSWebUploader,
} from "tonstarter-contracts";
import { atom, useRecoilValue } from "recoil";
import { Address, TonClient, toNano } from "ton";
import useConnectionStore from "store/connection-store/useConnectionStore";
import Input from "components/Input";
import { formSpec } from "./data";
import { styled } from "@mui/styles";

const StyledForm = styled('form')({
    display: 'flex',
    flexDirection:'column',
    gap: '40px'
})


function DeployerScreen2() {
  return (
    <>
      <MyComp />
      <div className="App">
        <div style={{ display: "flex", flexDirection: "row", gap: 50 }}>
          <FormDeployStatus />
        </div>
      </div>
    </>
  );
}

const deployStateAtom = atom({
  key: "deployState2",
  default: {
    state: JettonDeployState.NOT_STARTED,
    contractAddress: null,
    jWalletAddress: null,
    jWalletBalance: null,
  },
});

function FormDeployStatus() {
  const state = useRecoilValue(deployStateAtom);

  return (
    <div>
      <List
        sx={{
          width: "100%",
          maxWidth: 360,
          bgcolor: "background.paper",
        }}
      >
        <ListItem>
          <ListItemText
            primary="Contract Address"
            secondary={state.contractAddress}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="JWallet Address"
            secondary={state.jWalletAddress}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="JWallet Balance"
            secondary={state.jWalletBalance}
          />
        </ListItem>
        <ListItem>
          <Card>
            <CardContent>
              <div>Raw content</div>
              <br />
              {/* <code>{JSON.stringify({koko: 1})}</code> */}
              {/* <Skeleton variant="rectangular" width={210} height={118} /> */}
            </CardContent>
          </Card>
        </ListItem>
      </List>
    </div>
  );
}



function MyComp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const myFile: any = useRef(null);
  const [jettonState, setJettonState] = useState({
    state: JettonDeployState.NOT_STARTED,
    contractAddress: null,
    jWalletAddress: null,
  });
  const { session, address, adapterId } = useConnectionStore();
  const [jettonParams, setJettonParams] = useState({
    name: "MyJetton",
    symbol: "JET",
    mintAmount: 100,
    mintToOwner: true,
  });
  const [jettonData, setJettonData] = useState("");

  async function deployContract() {
    //@ts-ignore
    const ton = window.ton as any;
    const result = await ton.send("ton_requestWallets");

    if (result.length === 0) throw new Error("NO WALLET");

    const dep = new JettonDeployController(
      // @ts-ignore
      new TonClient({
        endpoint: EnvProfiles[Environments.MAINNET].rpcApi,
      })
    );
    if (!address) {
      return;
    }

    await dep.createJetton(
      {
        owner: Address.parse(address), // TODO from state. this could come from chrome ext
        mintToOwner: false,
        //@ts-ignore
        onProgress: (depState, err, extra) =>
          // @ts-ignore
          setJettonState((oldState) => ({
            // @ts-ignore
            ...oldState,
            state: depState,
            contractAddress:
              depState === JettonDeployState.VERIFY_MINT
                ? extra
                : oldState.contractAddress,
          })),
        jettonIconImageData: myFile.current,
        jettonName: jettonParams.name,
        jettonSymbol: jettonParams.symbol,
        amountToMint: toNano(jettonParams.mintAmount),
      },
      new ContractDeployer(),
      adapterId,
      session,
      new IPFSWebUploader()
    );
  }

  function handleChange(e: any, k: string) {
    setJettonParams((o) => ({ ...o, [k]: e.target.value }));
  }

  const onSubmit = (data: any) => {
    console.log(data);
  };

  return (
    <div className="App">
      <StyledForm onSubmit={handleSubmit(onSubmit)}>
        {formSpec.map((spec, index) => {
          return (
            <Input
              key={index}
              errorText=""
              error={errors[spec.name]}
              name={spec.name}
              control={control}
              label={spec.label}
              defaultValue={spec.default}
            />
          );
        })}

        <button>submit</button>
      </StyledForm>
      <header className="App-header">
        <div style={{ textAlign: "left" }}>
          <form>
            <div>
              Name{" "}
              <input
                type="text"
                value={jettonParams.name}
                onChange={(e) => {
                  handleChange(e, "name");
                }}
              />
            </div>
            <div>
              Symbol{" "}
              <input
                type="text"
                value={jettonParams.symbol}
                onChange={(e) => {
                  handleChange(e, "symbol");
                }}
              />
            </div>
            <div>
              Amount to mint{" "}
              <input
                type="number"
                value={jettonParams.mintAmount}
                onChange={(e) => {
                  handleChange(e, "mintAmount");
                }}
              />
            </div>
            <div>
              Mint to owner <input type="checkbox" defaultChecked disabled />
            </div>
            <div>
              <input
                type="file"
                onChange={(e) => {
                  myFile.current = e.target.files![0];
                }}
              />
            </div>
          </form>
        </div>
        <br />
        <div>Jetton: {JettonDeployState[jettonState.state]}</div>
        <div>{jettonState.contractAddress}</div>
        <div>
          <button onClick={deployContract}>Deploy contract</button>
        </div>

        <br />
        <br />
        <div>
          <button
            disabled={jettonState.state !== JettonDeployState.DONE}
            onClick={async () => {
              // TODO acquire env from state
              const dep = new JettonDeployController(
                // @ts-ignore
                new TonClient({
                  endpoint: EnvProfiles[Environments.MAINNET].rpcApi,
                }) // TODO!
              );

              // TODO acquire wallet address from state
              const details = await dep.getJettonDetails(
                Address.parse(jettonState.contractAddress!),
                Address.parse(
                  "kQDBQnDNDtDoiX9np244sZmDcEyIYmMcH1RiIxh59SRpKZsb"
                )
              );

              setJettonData(JSON.stringify(details, null, 3));
            }}
          >
            Get jetton details
          </button>
          <div>
            <textarea
              style={{ width: 600, height: 400 }}
              value={jettonData}
              readOnly
            ></textarea>
          </div>
        </div>
      </header>
    </div>
  );
}

export { DeployerScreen2 };
