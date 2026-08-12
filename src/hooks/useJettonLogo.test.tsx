import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";
import { MemoryRouter, useLocation, useNavigate } from "react-router-dom";
import { RecoilRoot } from "recoil";
import { useJettonLogo, useResetJettonLogoOnPathChange } from "./useJettonLogo";

let mockJettonAddress: string | null = "master-address";
let mockJettonStore: {
  jettonImage?: string;
  rawJettonImage?: string;
  jettonMaster?: string;
} = {};

jest.mock("hooks/useJettonAddress", () => ({
  useJettonAddress: () => ({ jettonAddress: mockJettonAddress }),
}));

jest.mock("store/jetton-store/useJettonStore", () => () => mockJettonStore);

const LogoProbe = () => {
  const { jettonLogo, setLogoUrl, resetJetton, discardLogoDraft } = useJettonLogo();
  return (
    <>
      <span data-testid="logo-url">{jettonLogo.logoUrl}</span>
      <span data-testid="logo-image">{jettonLogo.image}</span>
      <span data-testid="logo-error">{String(jettonLogo.hasError)}</span>
      <button onClick={() => setLogoUrl("https://example.com/edited.png")}>Edit logo</button>
      <button onClick={() => setLogoUrl("https://example.com/a.png")}>Logo A</button>
      <button onClick={() => setLogoUrl("https://example.com/b.png")}>Logo B</button>
      <button onClick={discardLogoDraft}>Discard draft</button>
      <button onClick={resetJetton}>Reset logo</button>
    </>
  );
};

const EditorLifecycleProbe = () => {
  const [showEditor, setShowEditor] = useState(true);
  return (
    <>
      <button onClick={() => setShowEditor((visible) => !visible)}>Toggle editor</button>
      {showEditor && <LogoProbe />}
    </>
  );
};

const RouteLifecycleProbe = () => {
  const location = useLocation();
  const navigate = useNavigate();
  useResetJettonLogoOnPathChange(location.pathname);

  return (
    <>
      <LogoProbe />
      <button onClick={() => navigate(`${location.pathname}?address=other`)}>Change query</button>
      <button onClick={() => navigate("/jetton/other")}>Change path</button>
    </>
  );
};

beforeEach(() => {
  mockJettonAddress = "master-address";
  mockJettonStore = {
    jettonImage: "https://example.com/logo.png",
    rawJettonImage: "https://example.com/logo.png",
    jettonMaster: "master-address",
  };
});

test("preserves the edited logo while a different wallet view reloads", async () => {
  const view = render(
    <RecoilRoot>
      <LogoProbe />
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/logo.png"),
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit logo" }));
  await waitFor(() =>
    expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png"),
  );

  mockJettonStore = {};
  view.rerender(
    <RecoilRoot>
      <LogoProbe />
    </RecoilRoot>,
  );

  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png");

  mockJettonStore = {
    jettonImage: "https://example.com/logo.png",
    rawJettonImage: "https://example.com/logo.png",
    jettonMaster: "master-address",
  };
  view.rerender(
    <RecoilRoot>
      <LogoProbe />
    </RecoilRoot>,
  );

  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png");
});

test("adopts refreshed metadata until the user edits the logo", async () => {
  const view = render(
    <RecoilRoot>
      <LogoProbe />
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/logo.png"),
  );

  mockJettonStore = {
    jettonImage: "https://example.com/refreshed.png",
    rawJettonImage: "https://example.com/refreshed.png",
    jettonMaster: "master-address",
  };
  view.rerender(
    <RecoilRoot>
      <LogoProbe />
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/refreshed.png"),
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit logo" }));
  mockJettonStore = {
    jettonImage: "https://example.com/newer.png",
    rawJettonImage: "https://example.com/newer.png",
    jettonMaster: "master-address",
  };
  view.rerender(
    <RecoilRoot>
      <LogoProbe />
    </RecoilRoot>,
  );

  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png");

  fireEvent.click(screen.getByRole("button", { name: "Discard draft" }));
  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/newer.png");
});

test("does not clear an edited logo outside a parameterized jetton route", () => {
  mockJettonAddress = null;
  mockJettonStore = {};
  render(
    <RecoilRoot>
      <LogoProbe />
    </RecoilRoot>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit logo" }));

  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png");
});

test("preserves the edited logo when the metadata editor unmounts and remounts", async () => {
  render(
    <RecoilRoot>
      <EditorLifecycleProbe />
    </RecoilRoot>,
  );

  await waitFor(() =>
    expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/logo.png"),
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit logo" }));
  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png");

  fireEvent.click(screen.getByRole("button", { name: "Toggle editor" }));
  expect(screen.queryByTestId("logo-url")).not.toBeInTheDocument();

  mockJettonStore = {};
  fireEvent.click(screen.getByRole("button", { name: "Toggle editor" }));

  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png");
});

test("preserves a draft across query changes and resets it across path changes", async () => {
  mockJettonAddress = null;
  mockJettonStore = {};
  render(
    <RecoilRoot>
      <MemoryRouter initialEntries={["/jetton/master-address"]}>
        <RouteLifecycleProbe />
      </MemoryRouter>
    </RecoilRoot>,
  );

  fireEvent.click(screen.getByRole("button", { name: "Edit logo" }));
  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png");

  fireEvent.click(screen.getByRole("button", { name: "Change query" }));
  expect(screen.getByTestId("logo-url")).toHaveTextContent("https://example.com/edited.png");

  fireEvent.click(screen.getByRole("button", { name: "Change path" }));
  await waitFor(() => expect(screen.getByTestId("logo-url")).toBeEmptyDOMElement());
});

test("ignores stale image callbacks after the logo URL changes", () => {
  mockJettonAddress = null;
  mockJettonStore = {};
  const originalImage = global.Image;
  const images: Array<{
    src: string;
    onload: null | (() => void);
    onerror: null | (() => void);
  }> = [];

  class ControlledImage {
    src = "";
    onload: null | (() => void) = null;
    onerror: null | (() => void) = null;

    constructor() {
      images.push(this);
    }
  }

  Object.defineProperty(global, "Image", { configurable: true, value: ControlledImage });

  try {
    render(
      <RecoilRoot>
        <LogoProbe />
      </RecoilRoot>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Logo A" }));
    const imageA = images[0];
    const staleError = imageA.onerror;
    fireEvent.click(screen.getByRole("button", { name: "Logo B" }));
    const imageB = images[1];

    act(() => imageB.onload?.());
    expect(screen.getByTestId("logo-image")).toHaveTextContent("https://example.com/b.png");
    expect(screen.getByTestId("logo-error")).toHaveTextContent("false");

    act(() => staleError?.());
    expect(screen.getByTestId("logo-image")).toHaveTextContent("https://example.com/b.png");
    expect(screen.getByTestId("logo-error")).toHaveTextContent("false");
  } finally {
    Object.defineProperty(global, "Image", { configurable: true, value: originalImage });
  }
});
