import { BaseSyntheticEvent, useEffect, useState } from 'react';
import { v4 as uuid } from 'uuid'
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { useLangPairs } from '../hooks/useLangPairs';

export const AddSetForm = () => {
  const [pairsTitle, setPairsTitle] = useState('')
  const [langAData, setLangAData] = useState('')
  const [langBData, setLangBData] = useState('')
  const { langPairs, setLangPair } = useLangPairs()

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

    setPairsTitle('')
    setLangAData('')
    setLangBData('')
  }

  useEffect(() => {
    localStorage.setItem('collection', JSON.stringify(langPairs))
  }, [langPairs])

  return (
    <Card>
      <h2 style={{ margin: '0 0 1rem' }}>New Set</h2>
      <form onSubmit={submitForm}>
        <InputText
          value={pairsTitle}
          placeholder="Title"
          onChange={(e) => setPairsTitle(e.target.value)}
        />
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          margin: '1rem 0',
        }}>
          <InputTextarea
            placeholder="First language"
            value={langAData}
            onChange={(e) => setLangAData(e.target.value)}
            autoResize
          />
          <InputTextarea
            placeholder="Second language"
            value={langBData}
            onChange={(e) => setLangBData(e.target.value)}
            autoResize
          />
        </div>
        <Button
          label="Save"
          disabled={!pairsTitle.length || !langAData.length || !langBData.length}
        />
      </form>
    </Card>
  )
}