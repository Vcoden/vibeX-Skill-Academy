import { useEffect, useRef, useState } from 'react'
import { errorMessage } from '@/lib/format'

export function useQuery<T>(query: () => Promise<T>, key: string) {
  const queryRef = useRef(query)
  queryRef.current = query
  const [data, setData] = useState<T | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [nonce, setNonce] = useState(0)

  useEffect(() => {
    let active = true
    setLoading(true)
    queryRef.current()
      .then((result) => {
        if (!active) return
        setData(result)
        setError(null)
      })
      .catch((err: unknown) => {
        if (!active) return
        setData(null)
        setError(errorMessage(err))
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => {
      active = false
    }
  }, [key, nonce])

  return {
    data,
    error,
    loading,
    reload: () => setNonce((value) => value + 1),
  }
}
