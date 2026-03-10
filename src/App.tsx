import { useAppDispatch } from "./app/hooks";
import { AuthGate } from "./features/auth/AuthGate";
import { clearToken } from "./features/auth/authSlice";
import { ShipsPage } from "./features/ships/ShipsPage";
import { useGetAgentQuery } from './services/spacetradersApi'

function AgentDashboard() {
  const dispatch = useAppDispatch();

  const { data, error, isLoading, isFetching } = useGetAgentQuery();

  if (isLoading) {
    return <p>Loading agent data...</p>;
  }

  // Really simple error handling for now
  if (error) {
    return (
      <div>
        <h2>Could not load agent data.</h2>
        <p>Your token may be invalid.</p>
        <button onClick={() => dispatch(clearToken())}>Clear Token</button>
      </div>
    );
  }

  // Avoid crashing if data is missing
  if (!data) {
    return <p>No data found.</p>;
  }

  const agent = data.data;

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', padding: '1rem' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1>SpaceTraders Dashboard</h1>
        <button onClick={() => dispatch(clearToken())}>Clear token</button>
      </header>

      {isFetching && <p>Refreshing...</p>}

      <section
        style={{
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: '1rem',
          marginTop: '1rem',
        }}
      >
        <h2>Agent Summary</h2>
        <p><strong>Symbol:</strong> {agent.symbol}</p>
        <p><strong>Headquarters:</strong> {agent.headquarters}</p>
        <p><strong>Credits:</strong> {agent.credits.toLocaleString()}</p>
        <p><strong>Ships:</strong> {agent.shipCount}</p>
      </section>

      <ShipsPage />
    </div>
  );
}

export default function App() {
  return (
    <AuthGate>
      <AgentDashboard />
    </AuthGate>
  );
}
