import { ReactNode, createContext, useContext, useState, useEffect } from 'react'

export type LangPair = {
  id: string;
  langA: string;
  langB: string;
  comment: string;
  toRepeat: boolean;
  isLearned: boolean;
  isLangAVisible: boolean;
  isLangBVisible: boolean;
}

interface LangPairCtx {
  langPairs: Record<string, LangPair[]> | null
  setLangPair: (payload: Record<string, LangPair[]>) => void
}

interface LangPairProps {
  value: Record<string, LangPair[]> | null
  children: ReactNode
}

const LangPairContext = createContext<LangPairCtx>({
  langPairs: null,
  setLangPair: (payload: Record<string, LangPair[]>) => { }
})

export const useLangPairs = () => useContext(LangPairContext)
export const LangPairsProvider = ({ value, children }: LangPairProps) => {
  const [langPairs, setLangPair] = useState<typeof value>(value)

  useEffect(() => {
    const collection = localStorage.getItem('collection')
    if (collection) {
      setLangPair(JSON.parse(collection))
    }
  }, [])

  return (
    <LangPairContext.Provider value={{ langPairs, setLangPair }}>
      {children}
    </LangPairContext.Provider>
  )
}
