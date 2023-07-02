import BN from "bn.js";
import { persistenceType } from "lib/jetton-minter";
import { atom } from "recoil";

export interface JettonStoreState {
  isAdmin: boolean;
  adminRevokedOwnership: boolean;
  symbol?: string;
  decimals?: string;
  name?: string;
  jettonImage?: string;
  isImageBroken?: boolean;
  description?: string;
  adminAddress?: string;
  balance?: BN;
  jettonMaster?: string;
  persistenceType?: persistenceType;
  totalSupply?: BN;
  jettonWalletAddress?: string;
  isJettonDeployerFaultyOnChainData?: boolean;
  jettonLoading: boolean;
  isMyWallet: boolean;
  selectedWalletAddress?: string | null;
  isCodeOld: boolean;
  isNewMinterDeployed: boolean;
  isMigrationMasterDeployed: boolean;
  mintedJettonsToMaster: boolean;
  migrationStarted: boolean;
  newMinterAddress: string;
  migrationId?: string;
  migrationHelper?: string;
  migrationHelperBalance?: BN;
  isMigrationHelperDeployed: boolean;
  transferredJettonsToHelper: boolean;
}

const jettonStateAtom = atom<JettonStoreState>({
  key: "jettonStateAtom",
  default: {
    jettonLoading: false,
    persistenceType: undefined,
    isAdmin: false,
    adminRevokedOwnership: true,
    symbol: undefined,
    decimals: "9",
    name: undefined,
    jettonImage: undefined,
    isImageBroken: false,
    description: undefined,
    adminAddress: undefined,
    balance: undefined,
    jettonMaster: undefined,
    totalSupply: undefined,
    jettonWalletAddress: undefined,
    isJettonDeployerFaultyOnChainData: false,
    isMyWallet: false,
    selectedWalletAddress: undefined,
    isCodeOld: false,
    isNewMinterDeployed: false,
    isMigrationMasterDeployed: false,
    mintedJettonsToMaster: false,
    migrationStarted: false,
    newMinterAddress: "",
    migrationId: "",
    migrationHelper: "",
    migrationHelperBalance: undefined,
    isMigrationHelperDeployed: false,
    transferredJettonsToHelper: false,
  },
});

export { jettonStateAtom };
