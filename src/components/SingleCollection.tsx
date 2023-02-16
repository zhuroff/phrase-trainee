import { BaseSyntheticEvent, ReactNode, useEffect, useState } from 'react'
import { Card } from 'primereact/card'
import { LangPair, useLangPairs } from '../hooks/useLangPairs'
import { useLayoutSwitcher } from '../hooks/useLayoutSwitcher'
import { DataTable } from 'primereact/datatable'
import { Column } from 'primereact/column'
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { ConfirmPopup, confirmPopup } from 'primereact/confirmpopup';

export const SingleCollection = () => {
  const { currentCollection, setCurrentCollection } = useLayoutSwitcher()
  const { langPairs, setLangPair } = useLangPairs()
  const [editableField, setEditableField] = useState<(Pick<LangPair, 'id'> & { key: keyof LangPair }) | null>(null)
  const [collectionTitle, setCollectionTitle] = useState<string | null>(null)
  const [newFieldValue, setNewFieldValue] = useState('')
  const [showOnlyUnlearned, setShowOnlyUnlearned] = useState(false)

  useEffect(() => {
    if (langPairs) {
      localStorage.setItem('collection', JSON.stringify(langPairs))
    }
  }, [langPairs])

  if (!langPairs || !currentCollection) {
    return <></>
  }

  const dataFilter = () => {
    if (!showOnlyUnlearned) return langPairs[currentCollection]
    return langPairs[currentCollection].filter(({ isLearned, toRepeat }) => !isLearned || toRepeat)
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

  const changeRowProperty = (key: keyof LangPair, value: boolean | string, id: string) => {
    if (currentCollection) {
      setLangPair({
        ...langPairs,
        [currentCollection]:
          langPairs[currentCollection].map((el) => (
            id === el.id
              ? { ...el, [key]: value }
              : el
          ))
      })
    }
  }

  const deleteRow = (e: BaseSyntheticEvent, id: string) => {
    confirmPopup({
      target: e.currentTarget,
      message: 'Are you sure you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (currentCollection) {
          setLangPair({
            ...langPairs,
            [currentCollection]:
              langPairs[currentCollection].filter((el) => el.id !== id)
          })
        }
      }
    })
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
        className={`p-button-sm p-button-rounded ${row[prop] ? 'p-button-text' : 'p-button-secondary'}`}
        onClick={() => changeRowProperty(prop, row[prop] ? false : true, row.id)}
      />
    )
  }

  const checkCellBody = (row: LangPair, { rowIndex }: { rowIndex: number }) => {
    return (
      <div style={{ display: 'flex' }}>
        <Button
          icon="pi pi-check"
          className={`p-button-sm p-button-rounded ${!row.isLearned ? 'p-button-text' : 'p-button-secondary'}`}
          onClick={() => changeRowProperty('isLearned', row.isLearned ? false : true, row.id)}
        />
        <Button
          icon="pi pi-replay"
          className={`p-button-sm p-button-rounded ${!row.toRepeat ? 'p-button-text' : 'p-button-secondary'}`}
          onClick={() => changeRowProperty('toRepeat', row.toRepeat ? false : true, row.id)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-sm p-button-rounded p-button-text"
          onClick={(e) => deleteRow(e, row.id)}
        />
      </div>
    )
  }

  const langColumnBody = (row: LangPair, rowIndex: number, prop: keyof LangPair, children?: ReactNode) => {
    return (
      row.id === editableField?.id && prop === editableField.key
        ? <div style={{ display: 'flex', alignItems: 'center' }}>
          <InputText
            value={newFieldValue}
            style={{ flex: '1 1 0', marginRight: '0.5rem' }}
            onInput={(e) => setNewFieldValue(e.currentTarget.value)}
          />
          <Button
            icon="pi pi-sync"
            className="p-button-sm p-button-rounded p-button-text"
            style={{ flex: 'none' }}
            onClick={() => {
              changeRowProperty(prop, newFieldValue, row.id)
              setNewFieldValue('')
              setEditableField(null)
            }}
          />
        </div>
        : <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>{row[prop]}</span>
          <Button
            icon="pi pi-pencil"
            className="p-button-sm p-button-rounded p-button-text"
            style={{ flex: 'none' }}
            onClick={() => {
              setNewFieldValue(row[prop].toString())
              setEditableField({ id: row.id, key: prop })
            }}
          />
          {children && children}
        </div>
    )
  }

  const filterThead = () => {
    return (
      <Button
        label={showOnlyUnlearned ? 'Show all' : 'Hide learned'}
        className="p-button-help p-button-sm"
        onClick={() => setShowOnlyUnlearned(!showOnlyUnlearned)}
      />
    )
  }

  const saveNewCollectionTitle = () => {
    if (collectionTitle) {
      const newLangPairs = Object.entries(langPairs).reduce<Record<string, LangPair[]>>((acc, [key, value]) => {
        if (key === currentCollection) key = collectionTitle
        acc[key] = value
        return acc
      }, {})
      setLangPair(newLangPairs)
      setCurrentCollection(collectionTitle)
      setCollectionTitle(null)
    }
  }

  const GoogleTranslateButton = ({ phrase }: { phrase: string }) => (
    <Button
      icon="pi pi-google"
      className="p-button-sm p-button-rounded p-button-text"
      style={{ flex: 'none' }}
      onClick={() => window.open(`
        https://translate.google.com/?sl=en&tl=ru&text=${phrase}&op=translate
      `)}
    />
  )

  return (
    <Card style={{ position: 'relative' }}>
      <h2
        className="card-title"
        style={{
          margin: '0 0 1rem',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {!collectionTitle
          ? <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>{currentCollection}</span>
            <Button
              icon="pi pi-pencil"
              className="p-button-rounded p-button-text"
              onClick={() => setCollectionTitle(currentCollection)}
            />
          </div>
          : <div style={{ display: 'flex', alignItems: 'center', flex: '1 1 0' }}>
            <InputText
              value={collectionTitle}
              style={{ width: '50%' }}
              onInput={(e) => setCollectionTitle(e.currentTarget.value)}
            />
            <Button
              icon="pi pi-sync"
              className="p-button-rounded p-button-text"
              onClick={saveNewCollectionTitle}
            />
          </div>
        }
      </h2>
      <Button
        icon="pi pi-times"
        style={{ position: 'absolute', right: '1rem', top: '1rem' }}
        className="p-button-rounded p-button-text"
        onClick={() => setCurrentCollection(null)}
      />
      <DataTable
        value={dataFilter()}
        responsiveLayout="scroll"
        rowClassName={rowClassName}
        rowHover
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
          body={(row: LangPair, options) => (
            langColumnBody(row, options.rowIndex, 'langB', <GoogleTranslateButton phrase={row.langB} />)
          )}
        />
        <Column
          header={filterThead}
          body={checkCellBody}
        />
      </DataTable>
      <ConfirmPopup />
    </Card>
  )
}