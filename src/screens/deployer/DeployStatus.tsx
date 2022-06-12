import { Box } from "@mui/material";
import { Popup } from "components/Popup";
import { DeployProgressState } from "./types";
import CircularProgress from "@mui/material/CircularProgress";
import { styled } from "@mui/styles";
import { useRef } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
  deployProgress: DeployProgressState;
  deployInProgress: boolean;
  error: string | null;
}

interface ContentProps {
  deployProgress: DeployProgressState;
  deployInProgress: boolean;
  error: string | null;
}


const StyledContainer = styled(Box)({
  display: 'flex',
  flexDirection:'column',
  alignItems:'center',
  minHeight: '200px',
  justifyContent:'center',
  width:'600px'
  
})

const Content = ({ deployProgress, deployInProgress, error }: ContentProps) => {
  const aleadyDeployedRef = useRef(false)


    // TODO sy useEffect(() => {
    //   if(deployProgress.state === JettonDeployState.ALREADY_DEPLOYED){
    //     aleadyDeployedRef.current = true
    //   }
    // }, [deployProgress.state])
    

    
  if (error) {
    return <h2>{error}</h2>;
  }
  if (deployInProgress) {
    return (
      <>
        <h2>Deploying</h2>
        <CircularProgress />
      </>
    );
  }
  if (
    !deployInProgress &&
    aleadyDeployedRef.current
  ) {
    return <h2>Jetton already deployed</h2>;
  }
  return <h2>Deployed successfully</h2>;
};

function DeployStatus({
  open,
  onClose,
  deployProgress,
  deployInProgress,
  error,
}: Props) {
  return (
    <Popup open={open} onClose={onClose}>
        <StyledContainer>
        <Content
        deployProgress={deployProgress}
        deployInProgress={deployInProgress}
        error={error}
      />
        </StyledContainer>
    </Popup>
  );
}

export default DeployStatus;
