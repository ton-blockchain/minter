import { useParams } from "react-router-dom";
import { useEffect } from "react";

export const useJettonAddress = () => {
  const { id }: { id?: string } = useParams();

  useEffect(() => {
    console.log(id);
  }, [id]);
};
