import React from "react";
import { CreateExitStockForm } from "../components/CreateExitStockForm";
import { useStockMovement } from "../hooks/useStockMovement";
import { Container } from "./style/container";

export function CreateExitStockProductScreen() {
  const {loading, error, handleCreateStockUseStockMovement} = useStockMovement();

  return (
    <Container>
        <CreateExitStockForm onCreate={handleCreateStockUseStockMovement} loading={loading}/>
    </Container>
  );
}
