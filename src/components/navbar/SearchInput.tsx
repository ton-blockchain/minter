import { styled, IconButton, ClickAwayListener } from "@mui/material";
import { Box } from "@mui/system";
import { useCallback, useEffect, useState } from "react";
import SearchImg from "assets/search.svg";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "consts";
import { isValidAddress } from "utils";
import useNotification from "hooks/useNotification";
import theme from "theme";

const StyledContainer = styled(Box)(({ expanded }: { expanded: boolean }) => ({
  width: expanded ? 330 : 200,
  transition: "0.1s all",
  height: "100%",
  minHeight: 35,
  padding: "0px 17px",
  border: "1px solid #7A828A",
  borderRadius: 20,
  display: "flex",
  alignItems: "center",
  marginLeft: "auto",
  marginRight: 3,
  [theme.breakpoints.down('sm')]:{
    width: '100%',
    minHeight:'unset',
    height: 40
  }
}));

const StyledInput = styled("input")(({}) => ({
  border: "none",
  flex: 1,
  width: "100%",
  marginLeft: 6,
  color: "#7A828A",
  fontSize: 12,
  fontWeight: 500,
  fontFamily: "inherit",
  outline: "unset",
  [theme.breakpoints.down('sm')]: {
    fontSize: 16
  }

}));


interface Props{
  closeMenu?: () => void;
}

function SearchInput({closeMenu}: Props) {
  const [expanded, setExpanded] = useState(false);
  const [value, setValue] = useState("");
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const onSubmit = useCallback(async () => {
    if (!value) {
      return;
    }

    if (!isValidAddress(value)) {
      showNotification("Invalid jetton address", "error");
      setValue("");
      setExpanded(false);
      return;
    }

    setValue("");
    setExpanded(false);
    closeMenu?.()
    navigate(`${ROUTES.jetton}/${value}`);
  
  }, [value]);


  useEffect(() => {
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
      <StyledContainer expanded={expanded} className="search">
        <IconButton sx={{ padding: 0 }} onClick={onSubmit}>
          <img src={SearchImg} alt="" />
        </IconButton>
        <StyledInput
          placeholder="Jetton address"
          onPaste={(e: any) => setValue(e.target.value)}
          onChange={(e) => setValue(e.target.value)}
          value={value}
          onFocus={() => setExpanded(true)}
        />
      </StyledContainer>
    </ClickAwayListener>
  );
}

export default SearchInput;
