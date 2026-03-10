import { useState, type SubmitEventHandler } from "react";
import { useAppDispatch } from "../../app/hooks";
import { setToken } from "./authSlice";

export function TokenForm() {
  const dispatch = useAppDispatch();
  const [tokenInput, setTokenInput] = useState('');

  const handleSubmit: SubmitEventHandler<HTMLFormElement> = event => {
    event.preventDefault();

    const trimmed = tokenInput.trim();
    if (!trimmed) {
      return;
    }

    dispatch(setToken(trimmed));
    setTokenInput('');
  }

  return (
    <div style={{ maxWidth: 500, margin: '3rem auto', padding: '1rem' }}>
      <h1>SpaceTraders Dashboard</h1>
      <p>Paste your agent token to begin.</p>

      <form onSubmit={handleSubmit}>
        <input
          type="password"
          value={tokenInput}
          onChange={(e) => setTokenInput(e.target.value)}
          placeholder="SpaceTraders token"
          style={{ width: '100%', padding: '0.75rem', marginBottom: '0.75rem' }}
        />

        <button type="submit">Save token</button>
      </form>
    </div>
  );

}
