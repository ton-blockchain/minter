import { buildOnChainData, parseOnChainData } from "lib/jetton-minter";


test("Long serialization", () => {
  const longUrl =
    "https://bobbyhadz.com/blog/typescript-cannot-use-import-statement-outside-module#:~:text=To%20solve%20the%20error%20%22Cannot,run%20them%20directly%20with%20node%20.".repeat(100);
  
    const data = {
    image: longUrl,
    description: longUrl,
    name: longUrl,
    symbol: longUrl
  };

  expect(parseOnChainData(buildOnChainData(data))).toEqual(data);
});

test("Short serialization", () => {
  const data = { image: "nope" };
  expect(parseOnChainData(buildOnChainData(data))).toEqual(data);
});
