import { useState } from 'react';
import { useAppDispatch } from '../../../app/hooks';
import { setToken } from '../authSlice';
import { MutedText } from '../../../components/ui/MutedText';

export function TokenForm() {
  const dispatch = useAppDispatch();
  const [tokenInput, setTokenInput] = useState('');

  const handleSubmit = (event: React.SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmed = tokenInput.trim();
    if (!trimmed) {
      return;
    }

    dispatch(setToken(trimmed));
    setTokenInput('');
  };

  return (
    <div className='auth-shell'>
      <div className='panel auth-panel'>
        <h1 className='auth-title'>SpaceTraders Fleet Console Login</h1>
        <MutedText>Authenticate with your agent token to begin.</MutedText>

        <form className='auth-form' onSubmit={handleSubmit}>
          <input
            type='password'
            value={tokenInput}
            onChange={(e) => setTokenInput(e.target.value)}
            placeholder='SpaceTraders token'
          />

          <button type='submit'>Authorize</button>
        </form>
      </div>
    </div>
  );
}
