import { createFileRoute } from "@tanstack/react-router";
import { WalletProvider } from "@/context/WalletContext";
import { DashboardShell } from "@/components/wallet/DashboardShell";
import React from 'react';

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <WalletProvider>
      <DashboardShell />
    </WalletProvider>
  );
}
