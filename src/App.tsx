import type { ReactNode } from "react";
import { useAppDispatch } from "./app/hooks";
import { AuthGate } from "./features/auth/AuthGate";
import { clearToken } from "./features/auth/authSlice";
import { ShipsPage } from "./features/ships/ShipsPage";
import { useGetAgentQuery } from './services/spacetradersApi'
import { Panel } from "./components/ui/Panel";
import { PanelTitle } from "./components/ui/PanelTitle";
import { StatusText } from "./components/ui/StatusText";
import { StatCard } from "./components/ui/StatCard";
import { LoadingState } from "./components/ui/LoadingState";
import { ErrorState } from "./components/ui/ErrorState";
import { EmptyState } from "./components/ui/EmptyState";

type AppShellProps = {
  children: ReactNode
}
function AppShell({ children }: AppShellProps) {
  return (
    <div className='app-shell'>
      {children}
    </div>
  );
}

function AgentDashboard() {
  const dispatch = useAppDispatch();
  const { data, error, isLoading, isFetching } = useGetAgentQuery();

  if (isLoading) {
    return (
      <AppShell>
        <LoadingState title='Agent Summary' message='Loading agent data...' />
      </AppShell>
    );
  }

  // Really simple error handling for now
  if (error) {
    return (
      <AppShell>
        <ErrorState
          title='Authentication Failure'
          message='Your token may be invalid or expired.'
          action={
            <button className='danger-button' onClick={() => dispatch(clearToken())}>
              Clear Token
            </button>
          }
        />
      </AppShell>
    );
  }

  // Avoid crashing if data is missing
  if (!data) {
    return (
      <AppShell>
        <EmptyState title='Agent Summary' message='No data found.' />
      </AppShell>
    );
  }

  const agent = data.data;

  return (
    <AppShell>
      <header className='app-header'>
        <div>
          <h1 className='app-title'>SpaceTraders Fleet Console</h1>
          <p className='app-subtitle'>Autonomous commerce and navigation interface</p>
        </div>
        <button className='danger-button' onClick={() => dispatch(clearToken())}>
          Clear token
        </button>
      </header>

      {isFetching && <StatusText>Refreshing...</StatusText>}

      <Panel>
        <PanelTitle>Agent Summary</PanelTitle>

        <div className='info-grid'>
          <StatCard label='Agent' value={agent.symbol} />
          <StatCard label='Headquarters' value={agent.headquarters} />
          <StatCard label='Credits' value={agent.credits.toLocaleString()} />
          <StatCard label='Ships' value={agent.shipCount} />
        </div>
      </Panel>

      <ShipsPage />
    </AppShell>
  );
}

export default function App() {
  return (
    <AuthGate>
      <AgentDashboard />
    </AuthGate>
  );
}
