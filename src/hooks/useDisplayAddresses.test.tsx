import { act, renderHook, waitFor } from "@testing-library/react";
import { Address } from "ton";
import { Network, formatAddress } from "lib/network";
import { useDisplayAddresses } from "./useDisplayAddresses";

const address = Address.parseRaw(`0:${"ab".repeat(32)}`);
const other = Address.parseRaw(`0:${"cd".repeat(32)}`);
const fetchMock = jest.spyOn(global, "fetch");
afterEach(() => fetchMock.mockReset());
afterAll(() => fetchMock.mockRestore());

test("ignores a late result after the address and network change", async () => {
  let finishOld!: (response: Response) => void;
  fetchMock.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finishOld = resolve;
      }),
  );
  fetchMock.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      [other.toString()]: { user_friendly: formatAddress(other, "testnet", false) },
    }),
  } as Response);

  const view = renderHook(
    ({ value, network }: { value: string; network: Network }) =>
      useDisplayAddresses([value], network),
    {
      initialProps: { value: address.toString(), network: "mainnet" as Network },
    },
  );
  expect(view.result.current).toEqual([]);
  view.rerender({ value: other.toString(), network: "testnet" });
  await waitFor(() =>
    expect(view.result.current).toEqual([formatAddress(other, "testnet", false)]),
  );
  await act(async () =>
    finishOld({
      ok: true,
      json: async () => ({
        [address.toString()]: { user_friendly: formatAddress(address, "mainnet", true) },
      }),
    } as Response),
  );
  expect(view.result.current).toEqual([formatAddress(other, "testnet", false)]);
});
