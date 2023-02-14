import { createContext, ReactNode, useContext, useState } from 'react'

const initialState: LayoutSwitcher = {
  createSection: {
    isActive: false,
    label: 'Добавить'
  },
  collectionSection: {
    isActive: true,
    label: 'Коллекция'
  },
  currentCollection: {
    current: null,
    label: 'Сет'
  }
}

export type LayoutSwitcherBoolean = {
  isActive: boolean
  label: string
}

export type LayoutSwitcherCollection = {
  current: null | string
  label: string
}

export type LayoutSwitcher = {
  createSection: LayoutSwitcherBoolean
  collectionSection: LayoutSwitcherBoolean
  currentCollection: LayoutSwitcherCollection
}

interface LayoutSwitcherCtx {
  layoutParams: LayoutSwitcher
  setLayoutParams: (payload: LayoutSwitcher) => void
}

interface LayoutSwitcherProps {
  value?: LayoutSwitcher
  children: ReactNode
}

const LayoutSwitcherContext = createContext<LayoutSwitcherCtx>({
  layoutParams: { ...initialState },
  setLayoutParams: (payload: LayoutSwitcher) => { }
})

export const useLayoutSwitcher = () => useContext(LayoutSwitcherContext)
export const LayoutSwitcherProvider = ({ value, children }: LayoutSwitcherProps) => {
  const [layoutParams, setLayoutParams] = useState<LayoutSwitcher>({ ...initialState })

  return (
    <LayoutSwitcherContext.Provider value={{ layoutParams, setLayoutParams }}>
      {children}
    </LayoutSwitcherContext.Provider>
  )
}
