import { createContext, ReactNode, useContext, useState } from 'react'

const initialState: LayoutSwitcher = {
  createSection: {
    isActive: false,
    label: 'Add collection'
  },
  collectionSection: {
    isActive: true,
    label: 'Collection list'
  }
}

export type LayoutSwitcherBoolean = {
  isActive: boolean
  label: string
}

export type LayoutSwitcher = {
  createSection: LayoutSwitcherBoolean
  collectionSection: LayoutSwitcherBoolean
}

interface LayoutSwitcherCtx {
  layoutParams: LayoutSwitcher
  setLayoutParams: (payload: LayoutSwitcher) => void
  currentCollection: string | null,
  setCurrentCollection: (payload: string | null) => void
}

interface LayoutSwitcherProps {
  value?: LayoutSwitcher
  children: ReactNode
}

const LayoutSwitcherContext = createContext<LayoutSwitcherCtx>({
  layoutParams: { ...initialState },
  setLayoutParams: (payload: LayoutSwitcher) => { },
  currentCollection: '',
  setCurrentCollection: (payload: string | null) => { }
})

export const useLayoutSwitcher = () => useContext(LayoutSwitcherContext)
export const LayoutSwitcherProvider = ({ value, children }: LayoutSwitcherProps) => {
  const [layoutParams, setLayoutParams] = useState<LayoutSwitcher>({ ...initialState })
  const [currentCollection, setCurrentCollection] = useState<string | null>(null)

  return (
    <LayoutSwitcherContext.Provider value={{
      layoutParams,
      setLayoutParams,
      currentCollection,
      setCurrentCollection
    }}>
      {children}
    </LayoutSwitcherContext.Provider>
  )
}
