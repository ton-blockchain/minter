import useJettonStore from "store/jetton-store/useJettonStore";
import { AppButton } from "components/appButton";
import { CenteringWrapper } from "components/footer/styled";
import { Popup } from "components/Popup";
import { Typography } from "@mui/material";
import bullet from "assets/icons/bullet.svg";
import { Box } from "@mui/system";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNavigate } from "react-router-dom";
import WalletConnection from "services/wallet-connection";
import useConnectionStore from "store/connection-store/useConnectionStore";
import { TonConnection } from "@ton-defi.org/ton-connection";
import { Address, Cell, beginCell } from "ton";
import { JettonDeployParams, jettonDeployController } from "lib/deploy-controller";
import { createDeployParams, sleep } from "lib/utils";
import BN from "bn.js";
import { ContractDeployer } from "lib/contract-deployer";
import { toDecimalsBN } from "utils";
import analytics from "services/analytics";
import useNotification from "hooks/useNotification";
import {
  MIGRATION_HELPER_CODE,
  MIGRATION_HELPER_DEPLOY_GAS,
  MIGRATION_MASTER_CODE,
  MIGRATION_MASTER_DEPLOY_GAS,
  MigrationHelperConfig,
  MigrationMasterConfig,
  createMigrationHelper,
  createMigrationMaster,
  migrationHelperConfigToCell,
  migrationMasterConfigToCell,
} from "lib/migrations";
import { useJettonAddress } from "hooks/useJettonAddress";
import { transfer } from "lib/jetton-minter";
import { cellToAddress, makeGetCall } from "lib/make-get-call";
import { getClient } from "lib/get-ton-client";

export function UserMigrationPopup({
  open,
  setOpen,
  jettonMinter,
  migrationMaster,
}: {
  open: boolean;
  setOpen: (arg0: boolean) => void;
  jettonMinter: string;
  migrationMaster: string;
}) {
  const {
    symbol,
    isNewMinterDeployed,
    isMigrationMasterDeployed,
    mintedJettonsToMaster,
    migrationStarted,
    newMinterAddress,
    decimals,
    name,
    jettonImage,
    description,
    totalSupply,
    balance,
    jettonWalletAddress,
    isMigrationHelperDeployed,
    migrationHelperBalance,
    migrationHelper,
    transferredJettonsToHelper,
    setNewMinterDeployed,
    setMigrationMasterDeployed,
    setMintedJettonsToMaster,
    setMigrationStarted,
    setMigrationHelperDeployed,
    setMigrationHelperBalance,
    setTransferredJettonsToHelper,
  } = useJettonStore();
  const { address } = useConnectionStore();
  const { showNotification } = useNotification();
  const { jettonAddress } = useJettonAddress();

  const navigate = useNavigate();

  const onClose = () => {
    setOpen(false);
  };

  const onSubmit = async () => {
    const connection = WalletConnection.getConnection();
    if (!address || !connection) {
      throw new Error("Wallet not connected");
    }
    setMigrationStarted(true);
    if (!isMigrationHelperDeployed) await deployMigrationHelper(connection);
    await transferJettonsToHelper(connection);
  };

  const deployMigrationHelper = async (connection: TonConnection) => {
    if (!address || !connection) {
      throw new Error("Wallet not connected");
    }

    console.log(jettonAddress!, migrationMaster);

    const parsedJettonMaster = Address.parse(jettonAddress!);

    console.log(123);

    const migrationHelperConfig: MigrationHelperConfig = {
      oldJettonMinter: parsedJettonMaster,
      migrationMaster: Address.parse(migrationMaster),
      recipient: Address.parse(address),
    };
    console.log(123, address, MIGRATION_HELPER_CODE);
    const params = {
      code: MIGRATION_HELPER_CODE,
      data: await migrationHelperConfigToCell(migrationHelperConfig),
      deployer: Address.parse(address),
      value: MIGRATION_HELPER_DEPLOY_GAS,
    };
    console.log(123);
    const migrationHelperAddress = new ContractDeployer().addressForContract(params);
    console.log(123);
    const client = await getClient();
    console.log(123);
    const isDeployed = await client.isContractDeployed(migrationHelperAddress);
    console.log(123);

    if (isDeployed) {
      setMigrationHelperDeployed(true);
      return;
    }

    try {
      const result = await createMigrationHelper(
        migrationHelperConfig,
        connection,
        Address.parse(address),
      );
    } catch (err) {
      if (err instanceof Error) {
        showNotification(<>{err.message}</>, "error");
      }
    } finally {
      setMigrationHelperDeployed(true);
    }
  };

  const transferJettonsToHelper = async (connection: TonConnection) => {
    await sleep(1000);
    setTransferredJettonsToHelper(true);
  };

  interface TransactionStepProps {
    spinning: boolean;
    description: string;
  }

  const TransactionStep: React.FC<TransactionStepProps> = ({ spinning, description }) => (
    <Box display="flex" alignItems="center" sx={{ gap: 2, marginBottom: 2 }}>
      <Spinner spinning={spinning} />
      <Typography variant="body1">{description}</Typography>
    </Box>
  );

  const TransactionProgress = () => {
    return (
      <div>
        <Typography
          sx={{
            color: "#161C28",
            fontWeight: 800,
            fontSize: 20,
            marginBottom: 3.2,
            textAlign: "center",
          }}>
          Migration process
        </Typography>

        <Typography sx={{ color: "red", marginBottom: 2 }}>
          Do not close this page until you finish the process.
        </Typography>

        <TransactionStep
          spinning={!isMigrationHelperDeployed}
          description="Deploy the Migration Helper"
        />
        <TransactionStep
          spinning={!transferredJettonsToHelper}
          description="Transfer tokens to the Migration Helper"
        />
      </div>
    );
  };

  return (
    <Popup open={open} maxWidth={600} onClose={onClose}>
      {!migrationStarted ? (
        <>
          <Box ml={3} mt={-1} mb={-0.6} sx={{ alignSelf: "baseline", color: "#464646" }}>
            <Typography
              sx={{
                color: "#161C28",
                fontWeight: 800,
                fontSize: 20,
                marginBottom: 3.2,
                textAlign: "center",
              }}>
              Initiate migration
            </Typography>
            <Typography sx={{ fontWeight: 500, marginBottom: 2.2 }}>
              This operation will initiate the migration process of the <br /> token{" "}
              <span style={{ fontWeight: 900 }}>{symbol}</span>. This means:
            </Typography>
            <ul
              style={{
                listStyleImage: `url(${bullet})`,
                paddingLeft: 20,
                fontWeight: 500,
                marginBottom: 0,
              }}>
              <li style={{ marginBottom: 10 }}>
                <span style={{ paddingLeft: 5 }}>
                  You should only migrate your tokens if it is neccessary
                </span>
              </li>
              <li style={{ marginBottom: 10 }}>
                <span style={{ paddingLeft: 5 }}>
                  You will lose all your old <span style={{ fontWeight: 900 }}>{symbol}</span>
                </span>
              </li>
              <li style={{ marginBottom: 10 }}>
                <span style={{ paddingLeft: 5 }}>
                  You will receive exactly{" "}
                  <span style={{ fontWeight: 900 }}>{balance?.toString()}</span> tokens in the new
                  version of <span style={{ fontWeight: 900 }}>{symbol}</span>{" "}
                </span>
              </li>
              <li style={{ marginBottom: 10 }}>
                <span style={{ paddingLeft: 5 }}>
                  You will not be able to get back to the old version
                </span>
              </li>
            </ul>
            <Typography textAlign="left" sx={{ fontWeight: 700 }}>
              You should consider these points before initiating the migration.
            </Typography>
          </Box>
          <CenteringWrapper>
            <Box mr={4.2}>
              <AppButton transparent width={100} onClick={() => onClose()}>
                Cancel
              </AppButton>
            </Box>
            <AppButton
              width={100}
              onClick={() => {
                onSubmit();
              }}>
              Migration
            </AppButton>
          </CenteringWrapper>
        </>
      ) : (
        <>
          <TransactionProgress />
          {isMigrationHelperDeployed && transferredJettonsToHelper && (
            <AppButton
              width={200}
              onClick={() => {
                onClose();
                navigate(`/jetton/${newMinterAddress}`);
              }}>
              Go to the new Jetton
            </AppButton>
          )}
        </>
      )}
    </Popup>
  );
}

function Spinner({ spinning }: { spinning: boolean }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      {spinning ? <CircularProgress size={24} /> : <CheckCircleIcon color="primary" />}
    </Box>
  );
}
