import BN from "bn.js";
import { Address, contractAddress, toNano } from "ton";

import { createDeployParams } from "./utils";
import { buildJettonOffChainMetadata, burn, JETTON_MINTER_CODE, transfer } from "./jetton-minter";
import {
  dropJettonV2AdminBody,
  isJettonV2Code,
  JETTON_V2_MINTER_CODE,
  JETTON_V2_MINTER_CODE_HASH,
  mintJettonV2Body,
  updateJettonV2MetadataBody,
} from "./jetton-v2";

const owner = Address.parseRaw(
  "0:1111111111111111111111111111111111111111111111111111111111111111",
);

test("uses the official Jetton v2.1 code and StateInit for new deployments", () => {
  const previousQueryId = process.env.REACT_APP_DEPLOY_QUERY_ID;
  process.env.REACT_APP_DEPLOY_QUERY_ID = "0";
  const deploy = createDeployParams(
    {
      owner,
      amountToMint: new BN(5_000_000_000),
    },
    "ipfs://vector/jetton.json",
  );
  if (previousQueryId === undefined) {
    delete process.env.REACT_APP_DEPLOY_QUERY_ID;
  } else {
    process.env.REACT_APP_DEPLOY_QUERY_ID = previousQueryId;
  }

  expect(deploy.code.hash().toString("hex")).toBe(JETTON_V2_MINTER_CODE_HASH);
  expect(deploy.data.hash().toString("hex")).toBe(
    "b142a28677cead1ca3552a83882254e3f0e9b7a191b5afca90c22cfcc52126e1",
  );
  const address = contractAddress({
    workchain: 0,
    initialCode: deploy.code,
    initialData: deploy.data,
  });
  expect(address.workChain).toBe(0);
  expect(address.hash.toString("hex")).toBe(
    "4aaae41501c44f9975082540603edb68516a79d133e2baac08fb1fe90e6602ea",
  );
  expect(deploy.value.eq(toNano(0.15))).toBe(true);
  expect(deploy.message.hash().toString("hex")).toBe(
    "f8cada6649c5d4b95cdcd509ca618baf7b8bfc15059c630a7b762afecacb521f",
  );
});

test("serializes v2.1 management messages exactly like the Tolk contracts", () => {
  const queryId = 0x010203;

  expect(
    mintJettonV2Body(owner, owner, new BN(123_456_789), new BN(300_000_000), queryId)
      .hash()
      .toString("hex"),
  ).toBe("f92989032b54916e020f00ac92af452680c142536803e00f3c0a57fa1834e66e");

  const metadata = buildJettonOffChainMetadata("https://example.com/meta.json");
  expect(updateJettonV2MetadataBody(metadata, queryId).hash().toString("hex")).toBe(
    "e42bf0da7797277ffe8307b312305534d26fa0fd71b3772c1f2e5e023400957a",
  );
  expect(dropJettonV2AdminBody(queryId).hash().toString("hex")).toBe(
    "8eb1defc5c37995cec17eefda27f2d0105e3fd60991fe9814e107940b213086c",
  );
});

test("sets every available v2.1 excess destination to the payer", () => {
  const recipient = Address.parseRaw(
    "0:2222222222222222222222222222222222222222222222222222222222222222",
  );

  const mintBody = mintJettonV2Body(recipient, owner, new BN(1), toNano(0.05), 0);
  const mint = mintBody.beginParse();
  mint.readUint(32);
  mint.readUint(64);
  expect(mint.readAddress()?.equals(recipient)).toBe(true);
  mint.readCoins();
  const internalTransfer = mint.readRef();
  internalTransfer.readUint(32);
  internalTransfer.readUint(64);
  internalTransfer.readCoins();
  expect(internalTransfer.readAddress()).toBeNull();
  expect(internalTransfer.readAddress()?.equals(owner)).toBe(true);

  const transferBody = transfer(recipient, owner, new BN(1)).beginParse();
  transferBody.readUint(32);
  transferBody.readUint(64);
  transferBody.readCoins();
  expect(transferBody.readAddress()?.equals(recipient)).toBe(true);
  expect(transferBody.readAddress()?.equals(owner)).toBe(true);

  const burnBody = burn(new BN(1), owner).beginParse();
  burnBody.readUint(32);
  burnBody.readUint(64);
  burnBody.readCoins();
  expect(burnBody.readAddress()?.equals(owner)).toBe(true);
});

test("switches only the exact v2.1 code and leaves legacy contracts on the old path", () => {
  expect(isJettonV2Code(JETTON_V2_MINTER_CODE.toBoc())).toBe(true);
  expect(isJettonV2Code(JETTON_MINTER_CODE.toBoc())).toBe(false);
  expect(isJettonV2Code(null)).toBe(false);
});
