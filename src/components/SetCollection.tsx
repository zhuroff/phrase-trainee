import { LangPair, useLangPairs } from '../hooks/useLangPairs';
import { Card } from 'primereact/card';
import { useLayoutSwitcher } from '../hooks/useLayoutSwitcher';

export const SetCollection = () => {
  const { langPairs } = useLangPairs()
  const { setCurrentCollection } = useLayoutSwitcher()

  const learnedPercent = (data: LangPair[]) => {
    const learned = data.filter(({ isLearned }) => isLearned).length
    return {
      percent: `${(100 / (data.length / learned || 1)).toFixed(1)}%`,
      total: data.length,
      learned
    }
  }

  const collectionsList = () => langPairs && Object.entries(langPairs).sort((a, b) => a < b ? -1 : a > b ? 1 : 0)

  return (
    <Card>
      <h2 style={{ margin: '0 0 1rem' }}>Collection List</h2>
      {(langPairs && Object.keys(langPairs).length > 0) &&
        <ul style={{ columnCount: 3 }}>
          {
            collectionsList()?.map(([key, value], index) => {
              const computedData = learnedPercent(value)
              return (
                <li
                  key={`${index}_${key}`}
                  style={{ cursor: 'pointer', marginBottom: '0.5rem' }}
                  onClick={() => setCurrentCollection(key)}
                >
                  <span style={{
                    display: 'flex',
                    alignItems: 'center',
                    color: computedData.total === computedData.learned ? 'var(--green-500)' : 'var(--text-color)'
                  }}>{key}</span>
                  <i style={{
                    fontSize: '0.875rem',
                    color: computedData.total === computedData.learned ? 'var(--green-500)' : 'var(--surface-300)'
                  }}>
                    Phrases: {value.length}; Learned: {computedData.learned} ({computedData.percent})
                  </i>
                </li>
              )
            })
          }
        </ul>
      }
    </Card>
  )
}