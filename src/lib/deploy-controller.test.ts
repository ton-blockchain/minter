import BN from "bn.js";
import { Address, beginCell, toNano } from "ton";
import { CHAIN, TonConnectUI } from "@tonconnect/ui-react";

import { getClient } from "./get-ton-client";
import { jettonDeployController } from "./deploy-controller";
import { makeGetCall } from "./make-get-call";
import {
  buildJettonOnchainMetadata,
  burn,
  changeAdminBody,
  JETTON_MINTER_CODE,
  mintBody,
  transfer,
  updateMetadataBody,
} from "./jetton-minter";
import {
  dropJettonV2AdminBody,
  JETTON_V2_MINTER_CODE,
  mintJettonV2Body,
  updateJettonV2MetadataBody,
} from "./jetton-v2";
import { formatAddress } from "./network";
import { sendTransactionAndTrack } from "./transaction";
import { createDeployParams } from "./utils";
import { ContractDeployer } from "./contract-deployer";

jest.mock("./get-ton-client", () => ({
  getClient: jest.fn(),
}));

jest.mock("./utils", () => ({
  createDeployParams: jest.fn(),
  zeroAddress: () => {
    const { Address: TonAddress } = jest.requireActual("ton");
    return TonAddress.parse(`0:${"00".repeat(32)}`);
  },
}));

jest.mock("./transaction", () => ({
  ...jest.requireActual("./transaction"),
  sendTransactionAndTrack: jest.fn(async () => ({
    status: "confirmed",
    externalMessageHash: "hash",
  })),
}));

jest.mock("./make-get-call", () => ({
  ...jest.requireActual("./make-get-call"),
  makeGetCall: jest.fn(),
}));

const OWNER = Address.parse(`0:${"11".repeat(32)}`);
const MASTER = Address.parse(`0:${"22".repeat(32)}`);
const WALLET = Address.parse(`0:${"33".repeat(32)}`);
const RECIPIENT = Address.parse(`0:${"44".repeat(32)}`);

const mockedGetClient = getClient as jest.MockedFunction<typeof getClient>;
const mockedMakeGetCall = makeGetCall as jest.Mock;
const mockedSendTransactionAndTrack = sendTransactionAndTrack as jest.MockedFunction<
  typeof sendTransactionAndTrack
>;
const mockedCreateDeployParams = createDeployParams as jest.MockedFunction<
  typeof createDeployParams
>;

beforeEach(() => {
  mockedSendTransactionAndTrack.mockClear();
  mockedSendTransactionAndTrack.mockResolvedValue({
    status: "confirmed",
    externalMessageHash: "hash",
  });
  mockedGetClient.mockReset();
  mockedMakeGetCall.mockReset();
  mockedCreateDeployParams.mockReset();
});

test.each([
  {
    name: "legacy",
    code: JETTON_MINTER_CODE,
    amounts: [0.01, 0.04, 0.05, 0.031, 0.01, 0.01],
  },
  {
    name: "v2.1",
    code: JETTON_V2_MINTER_CODE,
    amounts: [0.05, 0.1, 0.05, 0.05, 0.05, 0.05],
  },
])("routes every $name write through its matching ABI and TON values", async (version) => {
  const connection = {} as TonConnectUI;
  const client = {
    getContractState: jest.fn(async (address: Address) => {
      if (!address.equals(MASTER)) throw new Error("Expected Jetton master address");
      return { code: version.code.toBoc() };
    }),
  } as any;
  mockedGetClient.mockResolvedValue(client);

  const amount = new BN(10);
  const updatedMetadata = buildJettonOnchainMetadata({ name: "Updated" });
  const fixedMetadata = buildJettonOnchainMetadata({ name: "Fixed", decimals: "6" });
  await jettonDeployController.burnAdmin(MASTER, connection, OWNER.toFriendly(), "testnet");
  await jettonDeployController.mint(connection, MASTER, amount, OWNER.toFriendly(), "testnet");
  await jettonDeployController.transfer(
    connection,
    MASTER,
    amount,
    RECIPIENT.toFriendly(),
    OWNER.toFriendly(),
    WALLET.toFriendly(),
    "testnet",
  );
  await jettonDeployController.burnJettons(
    connection,
    MASTER,
    amount,
    WALLET.toFriendly(),
    OWNER.toFriendly(),
    "testnet",
  );
  await jettonDeployController.updateMetadata(
    MASTER,
    { name: "Updated" },
    connection,
    OWNER.toFriendly(),
    "testnet",
  );
  await jettonDeployController.fixFaultyJetton(
    MASTER,
    { name: "Fixed", decimals: "6" },
    connection,
    OWNER.toFriendly(),
    "testnet",
  );

  const requests = mockedSendTransactionAndTrack.mock.calls.map(([, , request]) => request);
  const messages = requests.map((request) => request.messages[0]);
  expect(messages.map((message) => message.amount)).toEqual(
    version.amounts.map((amount) => toNano(amount).toString()),
  );
  expect(messages.map((message) => message.address)).toEqual([
    formatAddress(MASTER, "testnet"),
    formatAddress(MASTER, "testnet"),
    formatAddress(WALLET, "testnet"),
    formatAddress(WALLET, "testnet"),
    formatAddress(MASTER, "testnet"),
    formatAddress(MASTER, "testnet"),
  ]);
  expect(requests.every((request) => request.network === CHAIN.TESTNET)).toBe(true);
  expect(requests.every((request) => request.from === OWNER.toString())).toBe(true);
  expect(
    requests.every(
      (request) =>
        request.validUntil > Date.now() / 1000 && request.validUntil < Date.now() / 1000 + 301,
    ),
  ).toBe(true);

  const legacy = version.name === "legacy";
  const zeroAddress = Address.parse(`0:${"00".repeat(32)}`);
  const expectedBodies = [
    legacy ? changeAdminBody(zeroAddress) : dropJettonV2AdminBody(0),
    legacy
      ? mintBody(OWNER, amount, toNano(0.02), 0)
      : mintJettonV2Body(OWNER, OWNER, amount, toNano(0.05), 0),
    transfer(RECIPIENT, OWNER, amount),
    burn(amount, OWNER),
    legacy ? updateMetadataBody(updatedMetadata) : updateJettonV2MetadataBody(updatedMetadata, 0),
    legacy ? updateMetadataBody(fixedMetadata) : updateJettonV2MetadataBody(fixedMetadata, 0),
  ];
  expect(messages.map((message) => message.payload)).toEqual(
    expectedBodies.map((body) => body.toBoc().toString("base64")),
  );
  expect(mockedSendTransactionAndTrack).toHaveBeenCalledTimes(6);
});

test("reads a revoked v2.1 admin as null", async () => {
  const metadata = buildJettonOnchainMetadata({ name: "Test" });
  const addressCell = beginCell().storeAddress(WALLET).endCell();
  mockedMakeGetCall.mockImplementation(
    async (_address: Address, name: string, _params: unknown[], parser: Function) => {
      if (name === "get_jetton_data") {
        return parser([new BN(0), new BN(-1), null, metadata]);
      }
      return parser([addressCell]);
    },
  );
  mockedGetClient.mockResolvedValue({
    isContractDeployed: jest.fn(async () => false),
  } as any);

  const result = await jettonDeployController.getJettonDetails(MASTER, OWNER, "testnet");

  expect(result.minter.admin).toBeNull();
});
