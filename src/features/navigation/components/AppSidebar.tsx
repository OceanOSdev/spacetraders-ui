import { useAppDispatch, useAppSelector } from '../../../app/hooks';
import { setActiveView, type AppView } from '../appViewSlice';

const NAV_ITEMS: Array<{ label: string; value: AppView }> = [
  { label: 'Ships', value: 'ships' },
  { label: 'Contracts', value: 'contracts' },
];

export function AppSidebar() {
  const dispatch = useAppDispatch();
  const activeView = useAppSelector((state) => state.appView.activeView);

  return (
    <aside className='app-sidebar panel'>
      <div className='app-sidebar-title'>Command Nav</div>

      <nav className='app-sidebar-nav'>
        {NAV_ITEMS.map((item) => {
          const isActive = item.value === activeView;

          return (
            <button
              key={item.value}
              type='button'
              className={`app-sidebar-link${isActive ? ' is-active' : ''}`}
              onClick={() => dispatch(setActiveView(item.value))}
            >
              {item.label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
