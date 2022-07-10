import { Box, Typography } from '@mui/material';
import { styled } from '@mui/system';
import BaseButton from 'components/BaseButton';
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import { Popup } from 'components/Popup';
import useConnectionStore from 'store/connection-store/useConnectionStore';
import useJettonStore from 'store/jetton-store/useJettonStore';
import { useState } from 'react';
import TxLoader from 'components/TxLoader';
import { jettonDeployController } from 'lib/deploy-controller';
import { Address } from 'ton';
import WalletConnection from 'services/wallet-connection';

function FaultyDeploy() {
  const { address } = useConnectionStore();
  const {
    jettonMaster,
    getJettonDetails,
    isJettonDeployerFaultyOnChainData,
    isAdmin,
    symbol,
    name,
    description,
    jettonImage,
  } = useJettonStore();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    if (!address || !jettonMaster) {
      return;
    }
    try {
      setIsLoading(true);
      await jettonDeployController.fixFaultyJetton(
        Address.parse(jettonMaster),
        {
          symbol,
          name,
          description,
          image: jettonImage,
        },
        WalletConnection.getConnection(),
      );
      await getJettonDetails();
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <TxLoader open={isLoading}>
        <Typography>Loading...</Typography>
      </TxLoader>
      <Popup
        maxWidth={380}
        open={!!isJettonDeployerFaultyOnChainData && isAdmin && !isLoading}
        onClose={() => {}}
        hideCloseButton
      >
        <StyledWarningPopup>
          <Box className="header">
            <WarningAmberRoundedIcon />
            <Typography>Token metadata requires fix</Typography>
          </Box>
          <Box className="description">
            <Typography>
              This token was created with a previous faulty version of the
              deployer. Don’t worry, this can easily be fixed.
            </Typography>
            <br />
            <Typography>
              Click below to issue a fix transaction that will keep the token’s
              original data and fix the format.
            </Typography>
          </Box>
          <BaseButton onClick={onSubmit}>Submit</BaseButton>
        </StyledWarningPopup>
      </Popup>
    </>
  );
}

export default FaultyDeploy;

export const StyledWarningPopup = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  flexDirection: 'column',
  '& .header': {
    display: 'flex',
    textAlign: 'center',
    gap: 10,
    '* ': {
      color: '#d32f2f',
    },
    '& p': {
      fontSize: 22,
      fontWeight: 500,
    },
    '& svg': {
      position: 'relative',
      top: 4,
    },
  },
  '& .description': {
    marginTop: 20,
    '& p': {
      fontSize: 16,
      textAlign: 'center',
    },
  },
  '& .base-button': {
    marginTop: 40,
    height: 40,
    width: 200,
    background: '#d32f2f',
  },
});
