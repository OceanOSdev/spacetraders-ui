import { useState } from 'react';
import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { ShipSelector } from '../../ships/components/ShipSelector';
import { StatusText } from '../../../components/ui/StatusText';
import { useGetShipsQuery } from '../../ships/shipsApi';
import { useNegotiateContractMutation } from '../contractsApi';

export function ContractActionsPanel() {
  const [negotiateShip, setNegotiateShip] = useState('');

  const { data: shipsData, isFetching: isFetchingShips } = useGetShipsQuery();
  const [negotiateContract, { isLoading: isNegotiating, error }] = useNegotiateContractMutation();

  async function handleNegotiate() {
    if (!negotiateShip) return;

    try {
      await negotiateContract(negotiateShip).unwrap();
      setNegotiateShip('');
    } catch {
      // For now, leave error handling to UI
    }
  }

  return (
    <Panel className='contract-actions-panel'>
      <PanelTitle>Contract Actions</PanelTitle>

      <div className='contract-actions'>
        <div className='contract-action-group'>
          <div className='contract-action-label'>Negotiate new contract</div>

          <div className='contract-negotiate-row'>
            <ShipSelector
              value={negotiateShip}
              onChange={setNegotiateShip}
              options={
                shipsData?.data.map((ship) => ({
                  value: ship.symbol,
                  label: ship.symbol,
                })) ?? []
              }
              placeholder={isFetchingShips ? 'Loading ships...' : 'Select ship'}
            />

            <button
              onClick={handleNegotiate}
              disabled={!negotiateShip || isNegotiating}
              style={{ marginLeft: '0.75rem' }}
            >
              {isNegotiating ? 'Negotiating...' : 'Negotiate New Contract'}
            </button>
          </div>

          {error && <StatusText>Could not negotiate a new contract.</StatusText>}
        </div>
      </div>
    </Panel>
  );
}
