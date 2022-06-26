import { styled, IconButton, ClickAwayListener } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import SearchImg from "assets/search.svg";
import useJettonStore from "store/jetton-store/useJettonStore";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { useLocation, useNavigate } from "react-router-dom";
import { ROUTES } from "consts";

const StyledContainer = styled(Box)(({ expanded }: { expanded: boolean }) => ({
  width: expanded ? 260 : 160,
  transition: "0.1s all",
  height: 35,
  padding: "0px 17px",
  border: "1px solid #7A828A",
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
}));

const StyledInput = styled("input")({
  border: "none",
  flex: 1,
  width: "100%",
  marginLeft: 6,
  color: "#7A828A",
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "inherit",
  outline: "unset",
});

function SearchInput() {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const { getJettonDetails } = useJettonStore();
  const { address } = useConnectionStore();
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = useCallback(async () => {
    if (value) {
      setValue("");
      setExpanded(false);
      if (location.pathname.indexOf(ROUTES.jetton) < 0) {
        navigate(`${ROUTES.jetton}/${value}`);
      } else {
        getJettonDetails(value, address);
      }
    }
  }, [value]);

  const onChange = (e: any) => {
    const value = e.target.value;
    setValue(value);
  };

  const onPaste = (e: any) => {
    console.log(e.target.value);
    setValue(e.target.value);
  };

  useEffect(() => {
    console.log('test');
    
    const listener = (event: any) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault();
        onSubmit();
      }
    };
    document.addEventListener("keydown", listener);
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [value, onSubmit]);

  return (
    <ClickAwayListener onClickAway={() => setExpanded(false)}>
      <StyledContainer expanded={expanded}>
        <IconButton sx={{ padding: 0 }} onClick={onSubmit}>
          <img src={SearchImg} alt="" />
        </IconButton>
        <StyledInput
          placeholder="Search address"
          onPaste={onPaste}
          onChange={onChange}
          value={value}
          onFocus={() => setExpanded(true)}
        />
      </StyledContainer>
    </ClickAwayListener>
  );
}

export default SearchInput;
