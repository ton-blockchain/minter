import { buildJettonOnchainMetadata, readJettonMetadata } from "lib/jetton-minter";
import { beginCell, Cell } from "ton";
import axios from "axios";

jest.mock("axios");

test("Long serialization", async () => {
  const longUrl =
    "https://bobbyhadz.com/blog/typescript-cannot-use-import-statement-outside-module#:~:text=To%20solve%20the%20error%20%22Cannot,run%20them%20directly%20with%20node%20.".repeat(
      100,
    );

  const data = {
    image: longUrl,
    description: longUrl,
    name: longUrl,
    symbol: longUrl,
  };

  const resultC = buildJettonOnchainMetadata(data);
  const hexC = resultC.toBoc({ idx: false }).toString("hex");
  const deserC = Cell.fromBoc(hexC)[0];

  expect(await readJettonMetadata(deserC)).toEqual({
    persistenceType: "onchain",
    metadata: data,
    isJettonDeployerFaultyOnChainData: false,
  });
});

test("Short serialization", async () => {
  const data = { image: "nope" };
  expect(await readJettonMetadata(buildJettonOnchainMetadata(data))).toEqual({
    persistenceType: "onchain",
    metadata: data,
    isJettonDeployerFaultyOnChainData: false,
  });
});

test("Faulty serialization", async () => {
  const data = { image: "nope" };

  // Precomputed with faulty code prior to https://github.com/ton-defi-org/jetton-deployer-webclient/pull/61
  const faultyContentCell = Cell.fromBoc(
    "b5ee9c72c1010201002e000005010300c001004da00c20bad98ed5e80064bd29ab119ca237cb7fb76e7686fb8a3d948722faf487c7a00dcdee0cb04871a9c9",
  )[0];

  expect(await readJettonMetadata(faultyContentCell)).toEqual({
    persistenceType: "onchain",
    metadata: data,
    isJettonDeployerFaultyOnChainData: true,
  });
});

[
  ["http://fake", "offchain_private_domain"],
  ["http://ipfs.io/jjj", "offchain_ipfs"],
  ["ipfs://xkalsjcklas", "offchain_ipfs"],
].forEach(([url, persistenceType]) => {
  test(`Offchain deser - ${persistenceType} - ${url}`, async () => {
    const datacell = beginCell()
      .storeInt(0x01, 8) // off-chain marker (https://github.com/ton-blockchain/TIPs/issues/64)
      .storeBuffer(Buffer.from(url, "ascii"))
      .endCell();
    const data = { image: "nope" };

    // @ts-ignore
    axios.get.mockResolvedValueOnce({ data: data });

    expect(await readJettonMetadata(datacell)).toEqual({
      persistenceType,
      metadata: data,
    });
  });
});
