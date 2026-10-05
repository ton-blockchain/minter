import { act, renderHook } from "@testing-library/react";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Address } from "ton";
import { formatAddress } from "lib/network";
import { useAddressHistory } from "./useAddressHistory";

jest.mock("hooks/useNotification", () => () => ({ showNotification: jest.fn() }));
const account = Address.parseRaw(`0:${"ab".repeat(32)}`);
const other = Address.parseRaw(`0:${"cd".repeat(32)}`);

beforeEach(() => localStorage.clear());

test("deduplicates accounts, separates networks and clears only the current network", () => {
  const { result } = renderHook(() => ({ history: useAddressHistory(), navigate: useNavigate() }), {
    wrapper: ({ children }) => (
      <RecoilRoot>
        <MemoryRouter>{children}</MemoryRouter>
      </RecoilRoot>
    ),
  });
  act(() => result.current.history.onSubmit(formatAddress(account, "mainnet", false)));
  act(() => result.current.history.onSubmit(formatAddress(account, "mainnet", true)));
  expect(result.current.history.addresses).toEqual([account.toString()]);

  act(() => result.current.navigate("/?testnet=true"));
  expect(result.current.history.addresses).toEqual([]);
  act(() => result.current.history.onSubmit(formatAddress(other, "testnet", false)));
  expect(result.current.history.addresses).toEqual([other.toString()]);

  act(() => result.current.history.resetAddresses());
  expect(result.current.history.addresses).toEqual([]);
  act(() => result.current.navigate("/"));
  expect(result.current.history.addresses).toEqual([account.toString()]);
  act(() => result.current.history.removeAddress(formatAddress(account, "mainnet", false)));
  expect(result.current.history.addresses).toEqual([]);
});
