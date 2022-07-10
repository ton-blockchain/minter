import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import { styled, Typography } from '@mui/material';
import { Box } from '@mui/system';
import { ReactNode } from 'react';
import { isMobile } from 'react-device-detect';
import { Providers } from 'lib/env-profiles';
import useConnectionStore from 'store/connection-store/useConnectionStore';

interface Props {
  open: boolean;
  children?: ReactNode;
}

const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 10,
});

function TxLoader({ open, children }: Props) {
  const { adapterId } = useConnectionStore();
  const showReminderInLoader = !isMobile && adapterId === Providers.TON_HUB;

  return (
    <Backdrop
      sx={{
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 2,
        backdropFilter: 'blur(5px) ',
      }}
      open={open}
    >
      <StyledContainer>
        <CircularProgress color="inherit" />
        {children}
        {showReminderInLoader && (
          <Typography>
            Please check tonhub wallet for pending notification
          </Typography>
        )}
      </StyledContainer>
    </Backdrop>
  );
}

export default TxLoader;
