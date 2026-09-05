import { fireEvent, render, screen } from "@testing-library/react";
import { EditLogoPopup } from "./EditLogoPopup";

let mockLogoUrl = "";

jest.mock("hooks/useJettonLogo", () => ({
  useJettonLogo: () => ({
    jettonLogo: { logoUrl: mockLogoUrl },
    setLogoUrl: jest.fn(),
  }),
}));

test("updates an open editor when the metadata logo URL arrives", () => {
  const props = {
    showPopup: true,
    tokenImage: { description: "Logo URL" },
    close: jest.fn(),
  };
  const view = render(<EditLogoPopup {...props} />);

  expect(screen.getByRole("textbox")).toHaveValue("");

  mockLogoUrl = "https://example.com/logo.png";
  view.rerender(<EditLogoPopup {...props} />);

  expect(screen.getByRole("textbox")).toHaveValue("https://example.com/logo.png");
});

test("does not overwrite user input when metadata arrives later", () => {
  mockLogoUrl = "";
  const props = {
    showPopup: true,
    tokenImage: { description: "Logo URL" },
    close: jest.fn(),
  };
  const view = render(<EditLogoPopup {...props} />);

  fireEvent.change(screen.getByRole("textbox"), {
    target: { value: "https://example.com/draft.png" },
  });
  mockLogoUrl = "https://example.com/source.png";
  view.rerender(<EditLogoPopup {...props} />);

  expect(screen.getByRole("textbox")).toHaveValue("https://example.com/draft.png");
});
