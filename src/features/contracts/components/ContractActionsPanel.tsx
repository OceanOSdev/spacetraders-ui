import { Panel } from '../../../components/ui/Panel';
import { PanelTitle } from '../../../components/ui/PanelTitle';
import { StatusText } from '../../../components/ui/StatusText';
import { useNegotiateContractMutation } from '../api/contractsApi';

type ContractActionsPanelProps = {
  shipSymbol: string | undefined;
};

export function ContractActionsPanel({
  shipSymbol,
}: ContractActionsPanelProps) {
  const [negotiateContract, { isLoading: isNegotiating, error }] =
    useNegotiateContractMutation();

  async function handleNegotiate() {
    if (!shipSymbol) return;

    try {
      await negotiateContract(shipSymbol).unwrap();
    } catch (error) {
      console.error('Error negotiating contract:', error);
    }
  }

  return (
    <Panel>
      <PanelTitle>Contract Actions</PanelTitle>

      <div className='contract-actions'>
        <div className='contract-negotiate-row'>
          <button
            onClick={handleNegotiate}
            disabled={!shipSymbol || isNegotiating}
            style={{ marginLeft: '0.75rem' }}
          >
            {isNegotiating ? 'Negotiating...' : 'Negotiate New Contract'}
          </button>
        </div>

        {error && <StatusText>Could not negotiate a new contract.</StatusText>}
      </div>
    </Panel>
  );
}
