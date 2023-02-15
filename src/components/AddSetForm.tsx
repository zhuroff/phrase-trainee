import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useLangPairs } from '../hooks/useLangPairs';
import { useLayoutSwitcher } from '../hooks/useLayoutSwitcher';

export const AddSetForm = () => {
  const [pairsTitle, setPairsTitle] = useState('')
  const [langAData, setLangAData] = useState('')
  const [langBData, setLangBData] = useState('')
  const { langPairs, setLangPair } = useLangPairs()
  const { layoutParams, setLayoutParams, setCurrentCollection } = useLayoutSwitcher()

  const submitForm = (e: BaseSyntheticEvent) => {
    e.preventDefault()

    if (!pairsTitle.length || !langAData.length || !langBData.length) {
      throw new Error('empty')
    }

    const langA = langAData.split('\n').filter((el) => el)
    const langB = langBData.split('\n').filter((el) => el)

    if (langA.length !== langB.length) {
      throw new Error('length')
    }

    setLangPair({
      ...langPairs,
      [pairsTitle]: langA.map((el, index) => ({
        id: uuid(),
        langA: el,
        langB: langB[index],
        toRepeat: false,
        isLearned: false,
        isLangAVisible: true,
        isLangBVisible: true
      }))
    })

    setCurrentCollection(pairsTitle)
    setPairsTitle('')
    setLangAData('')
    setLangBData('')
    setLayoutParams({
      ...layoutParams,
      createSection: {
        ...layoutParams.createSection,
        isActive: false
      }
    })
  }

  useEffect(() => {
    localStorage.setItem('collection', JSON.stringify(langPairs))
  }, [langPairs])

  return (
    <Card>
      <h2 style={{ margin: '0 0 1rem' }}>New Collection</h2>
      <form onSubmit={submitForm}>
        <InputText
          value={pairsTitle}
          placeholder="Collection title"
          style={{ width: '100%' }}
          onChange={(e) => setPairsTitle(e.target.value)}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          margin: '1rem 0',
        }}>
          <InputTextarea
            placeholder="Language A"
            value={langAData}
            onChange={(e) => setLangAData(e.target.value)}
            autoResize
          />
          <InputTextarea
            placeholder="Language B"
            value={langBData}
            onChange={(e) => setLangBData(e.target.value)}
            autoResize
          />
        </div>
        <Button
          label="Save"
          className="p-button-sm p-button-help"
          disabled={!pairsTitle.length || !langAData.length || !langBData.length}
        />
      </form>
    </Card>
  )
}