import React from "react";
import { CreateEntryStockForm } from "../components/CreateEntryStockForm";
import { useStockMovement } from "../hooks/useStockMovement";
import { Container } from "./style/container";

export function CreateEntryStockProductScreen() {
  const {loading, error, handleCreateStockUseStockMovement} = useStockMovement();

  return (
    <Container>
        <CreateEntryStockForm onCreate={handleCreateStockUseStockMovement} loading={loading}/>
    </Container>
  );
}
