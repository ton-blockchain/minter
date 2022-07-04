import BaseButton from "components/BaseButton";
import React from "react";
import useJettonStore from "store/jetton-store/useJettonStore";

function BurnJettonsAction() {
    const {balance} = useJettonStore()
    if(!balance){
        return null
    }
  return <BaseButton>Burn</BaseButton>;
}

export default BurnJettonsAction;
