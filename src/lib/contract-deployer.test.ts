import BN from "bn.js";
import { TonConnectUI } from "@tonconnect/ui-react";
import { Address, beginCell } from "ton";
import { ContractDeployer } from "./contract-deployer";
import { sendTransactionAndTrack } from "./transaction";

jest.mock("./transaction", () => ({
  ...jest.requireActual("./transaction"),
  sendTransactionAndTrack: jest.fn(async () => ({
    status: "confirmed",
    externalMessageHash: "hash",
  })),
}));

test("deploy request pins testnet, sender, friendly destination, StateInit and payload", async () => {
  const deployer = Address.parseRaw(`0:${"11".repeat(32)}`);
  const code = beginCell().storeUint(1, 1).endCell();
  const data = beginCell().storeUint(2, 2).endCell();
  const message = beginCell().storeUint(3, 2).endCell();
  const connection = {} as TonConnectUI;
  const mockedSend = sendTransactionAndTrack as jest.MockedFunction<typeof sendTransactionAndTrack>;
  mockedSend.mockResolvedValueOnce({ status: "confirmed", externalMessageHash: "hash" });

  const result = await new ContractDeployer().deployContract(
    { deployer, value: new BN(150_000_000), code, data, message },
    connection,
    "testnet",
  );

  const [, network, request, target] = mockedSend.mock.calls[0];
  expect(network).toBe("testnet");
  expect(request.from).toBe(deployer.toString());
  expect(request.messages[0].address.startsWith("kQ")).toBe(true);
  expect(request.messages[0].stateInit).toBeTruthy();
  expect(request.messages[0].payload).toBe(message.toBoc().toString("base64"));
  expect((target as Address).equals(result.address)).toBe(true);
  expect(result.outcome).toEqual({ status: "confirmed", externalMessageHash: "hash" });
});
