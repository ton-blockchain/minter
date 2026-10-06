import { act, renderHook } from "@testing-library/react";
import { useEffect } from "react";
import { MemoryRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { Address } from "ton";
import { formatAddress } from "lib/network";
import { useAddressHistory } from "./useAddressHistory";

jest.mock("hooks/useNotification", () => () => ({ showNotification: jest.fn() }));
const account = Address.parseRaw(`0:${"ab".repeat(32)}`);
const other = Address.parseRaw(`0:${"cd".repeat(32)}`);

beforeEach(() => localStorage.clear());

test("selecting the current token from raw history keeps its canonical route", () => {
  const path = `/jetton/${formatAddress(account, "testnet")}?testnet=true#anchor`;
  const visitedPaths: string[] = [];
  const { result } = renderHook(
    () => {
      const history = useAddressHistory();
      const location = useLocation();
      useEffect(() => {
        visitedPaths.push(location.pathname);
      }, [location.pathname]);
      return { history, location };
    },
    {
      wrapper: ({ children }) => (
        <RecoilRoot>
          <MemoryRouter initialEntries={[path]}>
            <Routes>
              <Route path="/jetton/:id" element={children} />
            </Routes>
          </MemoryRouter>
        </RecoilRoot>
      ),
    },
  );
  const { pathname, search, hash } = result.current.location;
  expect(result.current.history.addresses).toEqual([account.toString()]);
  act(() => result.current.history.onAddressClick(account.toString()));
  expect(result.current.location).toMatchObject({ pathname, search, hash });
  expect(visitedPaths).toEqual([pathname]);
});

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
