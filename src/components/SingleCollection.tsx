import { useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { LangPair, useLangPairs } from '../hooks/useLangPairs'
import { useLayoutSwitcher } from '../hooks/useLayoutSwitcher'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

export const SingleCollection = () => {
  const { currentCollection, setCurrentCollection } = useLayoutSwitcher()
  const { langPairs, setLangPair } = useLangPairs()
  const [editableField, setEditableField] = useState<(Pick<LangPair, 'id'> & { key: keyof LangPair }) | null>(null)
  const [newFieldValue, setNewFieldValue] = useState('')

  useEffect(() => {
    if (langPairs) {
      localStorage.setItem('collection', JSON.stringify(langPairs))
    }
  }, [langPairs])

  if (!langPairs || !currentCollection) {
    return <></>
  }

  const showHideWholeColumn = (key: keyof LangPair, value: boolean) => {
    if (currentCollection) {
      setLangPair({
        ...langPairs,
        [currentCollection]:
          langPairs[currentCollection].map((el) => ({
            ...el,
            [key]: value
          }))
      })
    }
  }

  const changeRowProperty = (key: keyof LangPair, value: boolean | string, index: number) => {
    if (currentCollection) {
      setLangPair({
        ...langPairs,
        [currentCollection]:
          langPairs[currentCollection].map((el, i) => (
            index === i
              ? { ...el, [key]: value }
              : el
          ))
      })
    }
  }

  const langColumnHeader = (prop: keyof LangPair) => {
    if (
      currentCollection
      && langPairs[currentCollection].some((el) => !el[prop])
    ) {
      return (
        <Button
          label="Show column"
          className="p-button-help p-button-sm"
          onClick={() => showHideWholeColumn(prop, true)}
        />
      )
    }

    return (
      <Button
        label="Hide column"
        className="p-button-help p-button-sm"
        onClick={() => showHideWholeColumn(prop, false)}
      />
    )
  }

  const rowClassName = (row: LangPair) => {
    let className = ''

    if (!row.isLangAVisible) {
      className += 'hidden-a '
    }

    if (!row.isLangBVisible) {
      className += 'hidden-b '
    }

    if (row.toRepeat) {
      className += 'repeat '
    }

    if (row.isLearned) {
      className += 'learned'
    }

    return className
  }

  const actionsColumnBody = (row: LangPair, rowIndex: number, prop: keyof LangPair) => {
    return (
      <Button
        icon={`pi pi-eye${row[prop] ? '-slash' : ''}`}
        className={`p-button-sm p-button-rounded p-button-help ${row[prop] ? 'p-button-text' : ''}`}
        onClick={() => changeRowProperty(prop, row[prop] ? false : true, rowIndex)}
      />
    )
  }

  const checkCellBody = (row: LangPair, { rowIndex }: { rowIndex: number }) => {
    return (
      <div style={{ display: 'flex' }}>
        <Button
          icon="pi pi-check"
          className={`p-button-sm p-button-rounded p-button-help ${!row.isLearned ? 'p-button-text' : ''}`}
          onClick={() => changeRowProperty('isLearned', row.isLearned ? false : true, rowIndex)}
        />
        <Button
          icon="pi pi-replay"
          className={`p-button-sm p-button-rounded p-button-help ${!row.toRepeat ? 'p-button-text' : ''}`}
          onClick={() => changeRowProperty('toRepeat', row.toRepeat ? false : true, rowIndex)}
        />
      </div>
    )
  }

  const langColumnBody = (row: LangPair, rowIndex: number, prop: keyof LangPair) => {
    return (
      row.id === editableField?.id && prop === editableField.key
        ? <>
          <InputText
            value={newFieldValue}
            onInput={(e) => setNewFieldValue(e.currentTarget.value)}
          />
          <Button
            icon="pi pi-sync"
            className="p-button-rounded p-button-text"
            onClick={() => {
              changeRowProperty(prop, newFieldValue, rowIndex)
              setNewFieldValue('')
              setEditableField(null)
            }}
          />
        </>
        : <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>{row[prop]}</span>
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-text"
            onClick={() => {
              setNewFieldValue(row[prop].toString())
              setEditableField({ id: row.id, key: prop })
            }}
          />
        </div>
    )
  }

  return (
    <Card>
      <h2 style={{ margin: '0 0 1rem' }}>
        {currentCollection}
      </h2>
      <DataTable
        value={langPairs[currentCollection]}
        responsiveLayout="scroll"
        rowClassName={rowClassName}
      >
        <Column
          body={(row, options) => actionsColumnBody(row, options.rowIndex, 'isLangAVisible')}
        />
        <Column
          className="phrase lang-a"
          header={langColumnHeader('isLangAVisible')}
          body={(row, options) => langColumnBody(row, options.rowIndex, 'langA')}
        />
        <Column
          body={(row, options) => actionsColumnBody(row, options.rowIndex, 'isLangBVisible')}
        />
        <Column
          className="phrase lang-b"
          header={langColumnHeader('isLangBVisible')}
          body={(row, options) => langColumnBody(row, options.rowIndex, 'langB')}
        />
        <Column
          body={checkCellBody}
        />
      </DataTable>
    </Card>
  )
}