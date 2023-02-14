import { useState } from 'react';
import { LayoutSwitcherBoolean, LayoutSwitcherCollection, useLayoutSwitcher } from '../hooks/useLayoutSwitcher'
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';

export const NavBar = () => {
  const { layoutParams, setLayoutParams } = useLayoutSwitcher()
  const [isDialogVisible, setIsDialogVisible] = useState(false)
  const [jsonCollection, setJsonCollection] = useState('')
  const updateLayoutParams = (key: string, value: LayoutSwitcherBoolean | LayoutSwitcherCollection) => {
    setLayoutParams({
      ...layoutParams,
      [key]: 'isActive' in value
        ? { ...value, isActive: !value.isActive }
        : { ...value, current: null }
    })
  }
  const getAndPrintJSON = () => {
    const collection = localStorage.getItem('collection')
    if (collection) {
      setJsonCollection(collection)
      setIsDialogVisible(true)
    }
  }

  return (
    <>
      <nav style={{ position: 'fixed', padding: '1rem', top: 0, left: 0 }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {Object.entries(layoutParams).map(([key, value]) => (
            <li key={key} style={{ marginBottom: '0.5rem' }}>
              <Button
                label={value.label}
                onClick={() => updateLayoutParams(key, value)}
                className={
                  'isActive' in value
                    ? value.isActive ? 'p-button-secondary' : 'p-button-success'
                    : value.current ? 'p-button-secondary' : 'p-button-success'
                }
              />
            </li>
          ))}
          <li>
            <Button
              label="Get JSON"
              onClick={() => getAndPrintJSON()}
              className="p-button-secondary"
            />
          </li>
        </ul>
      </nav>
      <Dialog
        header="JSON collection"
        visible={isDialogVisible}
        style={{ width: '50vw' }}
        onHide={() => setIsDialogVisible(false)}
      >
        <InputTextarea value={jsonCollection} autoResize />
      </Dialog>
    </>
  )
}