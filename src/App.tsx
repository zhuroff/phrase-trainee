import { AddSetForm } from './components/AddSetForm';
import { NavBar } from './components/NavBar';
import { SetCollection } from './components/SetCollection';
import { SingleCollection } from './components/SingleCollection';
import { LangPairsProvider } from './hooks/useLangPairs';
import { useLayoutSwitcher } from './hooks/useLayoutSwitcher';
import './style.css';

export const App = () => {
  const { layoutParams } = useLayoutSwitcher()

  return (
    <div
      className="App"
      style={{
        padding: '1rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'grid',
        gap: '1rem'
      }}>
      <LangPairsProvider value={null}>
        <NavBar />
        {layoutParams.createSection.isActive &&
          <AddSetForm />
        }
        {layoutParams.collectionSection.isActive &&
          <SetCollection />
        }
        {layoutParams.currentCollection.current &&
          <SingleCollection />
        }
      </LangPairsProvider>
    </div>
  );
}
