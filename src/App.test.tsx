import {
  buildTokenMetadataCell,
  readJettonMetadata,
} from "lib/jetton-minter";
import { beginCell } from "ton";
import axios from "axios";

jest.mock("axios");

test("Long serialization", async () => {
  const longUrl =
    "https://bobbyhadz.com/blog/typescript-cannot-use-import-statement-outside-module#:~:text=To%20solve%20the%20error%20%22Cannot,run%20them%20directly%20with%20node%20.".repeat(
      100
    );

  const data = {
    image: longUrl,
    description: longUrl,
    name: longUrl,
    symbol: longUrl,
  };

  expect(await readJettonMetadata(buildTokenMetadataCell(data))).toEqual({
    isOnchain: true,
    metadata: data,
  });
});

test("Short serialization", async () => {
  const data = { image: "nope" };
  expect(await readJettonMetadata(buildTokenMetadataCell(data))).toEqual({
    isOnchain: true,
    metadata: data,
  });
});

test("Offchain deser", async () => {
  const datacell = beginCell()
    .storeInt(0x01, 8) // off-chain marker (https://github.com/ton-blockchain/TIPs/issues/64)
    .storeBuffer(Buffer.from("http://fake", "ascii"))
    .endCell();
  const data = { image: "nope" };

  // @ts-ignore
  axios.get.mockResolvedValueOnce({ data: data });

  expect(await readJettonMetadata(datacell)).toEqual({
    isOnchain: false,
    metadata: data,
  });
});
