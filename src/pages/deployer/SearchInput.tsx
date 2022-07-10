import { FormLabel, InputAdornment, styled, TextField } from '@mui/material';
import { Box } from '@mui/system';
import JettonImg from 'assets/jetton.svg';
import BaseButton from 'components/BaseButton';
import FieldDescription from 'components/FieldDescription';
import SectionLabel from 'components/SectionLabel';
import { ROUTES } from 'consts';
import React, { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Address } from 'ton';

const exampleAddress = 'EQBb4JNqn4Z6U6-nf0cSLnOJo2dxj1QRuGoq-y6Hod72jPbl';
const StyledContainer = styled(Box)({
  background: 'rgba(80, 167, 234, 0.2)',
  width: '100%',
  borderRadius: 16,
  padding: '20px 30px 30px 30px',
  '& .base-button': {
    fontSize: 13,
  },
});

const StyledFormTitle = styled(FormLabel)({
  fontWeight: 600,
  marginBottom: 10,
});

const StyledLink = styled('span')({
  '& p': {
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  '& a': {
    cursor: 'pointer',
    fontWeight: 600,
  },
});

function SearchInput() {
  const navigate = useNavigate();
  const [value, setValue] = useState('');
  const [error, setError] = useState(false);

  const onSubmit = useCallback(async () => {
    if (value) {
      try {
        Address.parse(value);
        setValue('');
        navigate(`${ROUTES.jetton}/${value}`);
      } catch (error) {
        setError(true);
      }
    }
  }, [value]);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const onFocus = () => {
    if (error) {
      setError(false);
    }
  };

  const onExample = () => {
    setValue(exampleAddress);
  };

  return (
    <StyledContainer>
      <StyledFormTitle>
        <SectionLabel>Search for an existing Jetton</SectionLabel>
      </StyledFormTitle>
      <StyledJettonSearch
        onChange={onChange}
        onFocus={onFocus}
        fullWidth
        value={value}
        helperText={error && <div>Invalid address</div>}
        error={error}
        placeholder="Jetton Address"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <img src={JettonImg} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <BaseButton disabled={!value} onClick={onSubmit}>
                Search
              </BaseButton>
            </InputAdornment>
          ),
        }}
      />
      <FieldDescription>
        Enter an existing Jetton contract address,{' '}
        <StyledLink>
          <a onClick={onExample}>example</a>
        </StyledLink>
      </FieldDescription>
    </StyledContainer>
  );
}

export default SearchInput;

const StyledJettonSearch = styled(TextField)(({ theme }) => ({
  '& .base-button': {
    height: 35,
  },
  '& input': {
    paddingTop: 15,
    paddingBottom: 15,
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.primary.main,
  },
}));
