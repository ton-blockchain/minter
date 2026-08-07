import BN from "bn.js";
import { Address, beginCell, toNano } from "ton";
import { CHAIN, TonConnectUI } from "@tonconnect/ui-react";

import { getClient } from "./get-ton-client";
import {
  JETTON_DEPLOY_MIN_BALANCE,
  JettonAlreadyDeployedError,
  jettonDeployController,
} from "./deploy-controller";
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

function connection(chain = CHAIN.TESTNET, address = OWNER) {
  return {
    account: { address: address.toString(), chain },
  } as unknown as TonConnectUI;
}

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
  const tonConnection = connection();
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
  await jettonDeployController.burnAdmin(MASTER, tonConnection, OWNER.toFriendly(), "testnet");
  await jettonDeployController.mint(tonConnection, MASTER, amount, OWNER.toFriendly(), "testnet");
  await jettonDeployController.transfer(
    tonConnection,
    MASTER,
    amount,
    RECIPIENT.toFriendly(),
    OWNER.toFriendly(),
    WALLET.toFriendly(),
    "testnet",
  );
  await jettonDeployController.burnJettons(
    tonConnection,
    MASTER,
    amount,
    WALLET.toFriendly(),
    OWNER.toFriendly(),
    "testnet",
  );
  await jettonDeployController.updateMetadata(
    MASTER,
    { name: "Updated" },
    tonConnection,
    OWNER.toFriendly(),
    "testnet",
  );
  await jettonDeployController.fixFaultyJetton(
    MASTER,
    { name: "Fixed", decimals: "6" },
    tonConnection,
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

function deployFixture() {
  const deployParams = {
    code: beginCell().storeUint(1, 1).endCell(),
    data: beginCell().storeUint(2, 2).endCell(),
    deployer: OWNER,
    value: toNano(0.15),
    message: beginCell().endCell(),
  };
  mockedCreateDeployParams.mockReturnValue(deployParams);
  return {
    deployParams,
    deterministicMaster: new ContractDeployer().addressForContract(deployParams),
  };
}

test("reports an existing deterministic master without another deploy or initial mint", async () => {
  const { deterministicMaster } = deployFixture();
  const getBalance = jest.fn();
  mockedGetClient.mockResolvedValue({
    getBalance,
    isContractDeployed: jest.fn(async () => true),
  } as any);

  const result = jettonDeployController.createJetton(
    {
      owner: OWNER,
      amountToMint: new BN(1),
      onchainMetaData: { name: "Existing", symbol: "EX", decimals: "9" },
    },
    connection(),
    "testnet",
  );

  const error = await result.catch((caught) => caught);
  expect(error).toBeInstanceOf(JettonAlreadyDeployedError);
  expect((error as JettonAlreadyDeployedError).address.equals(deterministicMaster)).toBe(true);
  expect(getBalance).not.toHaveBeenCalled();
  expect(mockedMakeGetCall).not.toHaveBeenCalled();
  expect(mockedSendTransactionAndTrack).not.toHaveBeenCalled();
});

test("returns the authoritative completed-trace outcome for a fresh deploy", async () => {
  const { deterministicMaster } = deployFixture();
  const getBalance = jest.fn(async () => toNano(1));
  const isContractDeployed = jest.fn(async () => false);
  mockedGetClient.mockResolvedValue({ getBalance, isContractDeployed } as any);

  const result = await jettonDeployController.createJetton(
    {
      owner: OWNER,
      amountToMint: new BN(1),
      onchainMetaData: { name: "Fresh", symbol: "NEW", decimals: "9" },
    },
    connection(),
    "testnet",
  );

  expect(result.address.equals(deterministicMaster)).toBe(true);
  expect(result).toMatchObject({ status: "confirmed", externalMessageHash: "hash" });
  expect(getBalance).toHaveBeenCalledWith(OWNER);
  expect(mockedMakeGetCall).not.toHaveBeenCalled();
  expect(mockedSendTransactionAndTrack).toHaveBeenCalledTimes(1);
});

test("requires 0.20 native coins while keeping the deploy message at 0.15", async () => {
  deployFixture();
  const getBalance = jest
    .fn()
    .mockResolvedValueOnce(toNano(0.15))
    .mockResolvedValueOnce(JETTON_DEPLOY_MIN_BALANCE);
  mockedGetClient.mockResolvedValue({
    getBalance,
    isContractDeployed: jest.fn(async () => false),
  } as any);
  const params = {
    owner: OWNER,
    amountToMint: new BN(1),
    onchainMetaData: { name: "Balance gate", symbol: "BG", decimals: "9" },
  };

  await expect(
    jettonDeployController.createJetton(params, connection(), "testnet"),
  ).rejects.toThrow("Not enough balance");
  expect(mockedSendTransactionAndTrack).not.toHaveBeenCalled();

  await expect(
    jettonDeployController.createJetton(params, connection(), "testnet"),
  ).resolves.toMatchObject({ status: "confirmed" });
  const request = mockedSendTransactionAndTrack.mock.calls[0][2];
  expect(request.messages[0].amount).toBe(toNano(0.15).toString());
});

test("propagates submitted deployment without waiting or inviting a duplicate mint", async () => {
  const { deterministicMaster } = deployFixture();
  mockedGetClient.mockResolvedValue({
    getBalance: jest.fn(async () => toNano(1)),
    isContractDeployed: jest.fn(async () => false),
  } as any);
  mockedSendTransactionAndTrack.mockResolvedValueOnce({ status: "submitted" });

  const result = await jettonDeployController.createJetton(
    {
      owner: OWNER,
      amountToMint: new BN(1),
      onchainMetaData: { name: "Pending", symbol: "P", decimals: "9" },
    },
    connection(),
    "testnet",
  );
  expect(result.address.equals(deterministicMaster)).toBe(true);
  expect(result).toMatchObject({ status: "submitted" });
  expect(mockedMakeGetCall).not.toHaveBeenCalled();
});

test("rejects a deployed jetton wallet that reports another owner", async () => {
  const metadata = buildJettonOnchainMetadata({ name: "Test" });
  mockedMakeGetCall.mockImplementation(
    async (_address: Address, name: string, _params: unknown[], parser: Function) => {
      if (name === "get_jetton_data") {
        return parser([new BN(0), new BN(-1), beginCell().storeAddress(OWNER).endCell(), metadata]);
      }
      if (name === "get_wallet_address") {
        return parser([beginCell().storeAddress(WALLET).endCell()]);
      }
      return parser([
        new BN(1),
        beginCell().storeAddress(RECIPIENT).endCell(),
        beginCell().storeAddress(MASTER).endCell(),
      ]);
    },
  );
  mockedGetClient.mockResolvedValue({
    isContractDeployed: jest.fn(async () => true),
  } as any);

  await expect(jettonDeployController.getJettonDetails(MASTER, OWNER, "testnet")).rejects.toThrow(
    "different owner",
  );
});

test("rejects negative token amounts before RPC access or transaction serialization", async () => {
  const tonConnection = connection();
  const negative = new BN(-100);

  await expect(
    jettonDeployController.createJetton(
      {
        owner: OWNER,
        amountToMint: negative,
        onchainMetaData: { name: "Invalid", symbol: "NEG", decimals: "9" },
      },
      tonConnection,
      "testnet",
    ),
  ).rejects.toThrow("Initial mint amount must be greater than zero");
  await expect(
    jettonDeployController.mint(tonConnection, MASTER, negative, OWNER.toFriendly(), "testnet"),
  ).rejects.toThrow("Mint amount must be greater than zero");
  await expect(
    jettonDeployController.transfer(
      tonConnection,
      MASTER,
      negative,
      RECIPIENT.toFriendly(),
      OWNER.toFriendly(),
      WALLET.toFriendly(),
      "testnet",
    ),
  ).rejects.toThrow("Transfer amount must be greater than zero");
  await expect(
    jettonDeployController.burnJettons(
      tonConnection,
      MASTER,
      negative,
      WALLET.toFriendly(),
      OWNER.toFriendly(),
      "testnet",
    ),
  ).rejects.toThrow("Burn amount must be greater than zero");

  expect(mockedGetClient).not.toHaveBeenCalled();
  expect(mockedSendTransactionAndTrack).not.toHaveBeenCalled();
});

test.each([
  { network: "testnet" as const, walletChain: CHAIN.MAINNET },
  { network: "mainnet" as const, walletChain: CHAIN.TESTNET },
])(
  "rejects a $walletChain wallet before deployment RPC on $network",
  async ({ network, walletChain }) => {
    await expect(
      jettonDeployController.createJetton(
        {
          owner: OWNER,
          amountToMint: new BN(1),
          onchainMetaData: { name: "Wrong network", symbol: "NET", decimals: "9" },
        },
        connection(walletChain),
        network,
      ),
    ).rejects.toThrow("Wallet network does not match");

    expect(mockedGetClient).not.toHaveBeenCalled();
    expect(mockedCreateDeployParams).not.toHaveBeenCalled();
    expect(mockedSendTransactionAndTrack).not.toHaveBeenCalled();
  },
);
