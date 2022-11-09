import React, { createContext, useState } from "react";

const JettonActionsContext = createContext({
  actionInProgress: false,
  startAction: () => {},
  finishAction: () => {},
});

interface JettonContextWrapperProps {
  children?: React.ReactNode;
}

const JettonActionContextWrapper: React.FC<JettonContextWrapperProps> = ({ children }) => {
  const [actionInProgress, setActionInProgress] = useState(false);

  const startAction = () => setActionInProgress(true);
  const finishAction = () => setActionInProgress(false);

  return (
    <JettonActionsContext.Provider value={{ actionInProgress, startAction, finishAction }}>
      {children}
    </JettonActionsContext.Provider>
  );
};

export { JettonActionsContext, JettonActionContextWrapper };
