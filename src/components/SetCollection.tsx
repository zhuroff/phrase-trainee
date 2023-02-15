import { useLangPairs } from '../hooks/useLangPairs';
import { Card } from 'primereact/card';
import { useLayoutSwitcher } from '../hooks/useLayoutSwitcher';

export const SetCollection = () => {
  const { langPairs } = useLangPairs()
  const { setCurrentCollection } = useLayoutSwitcher()

  return (
    <Card>
      <h2 style={{ margin: '0 0 1rem' }}>Collection</h2>
      {(langPairs && Object.keys(langPairs).length > 0) &&
        <ul>
          {
            Object.entries(langPairs).map(([key], index) => (
              <li
                key={`${index}_${key}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setCurrentCollection(key)}
              >{key}</li>
            ))
          }
        </ul>
      }
    </Card>
  )
}