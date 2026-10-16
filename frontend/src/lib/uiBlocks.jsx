import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { api } from '../api/client.js'

export function asBlockList(data) {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.results)) return data.results
  return []
}

export function findBlock(blocks, key) {
  if (!Array.isArray(blocks)) return null
  return blocks.find((item) => item?.key === key && item.is_visible !== false) || null
}

export function payloadOf(blocks, key) {
  const block = findBlock(blocks, key)
  return block?.payload && typeof block.payload === 'object' ? block.payload : {}
}

function stringField(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function contactChannels(blocks) {
  const contacts = payloadOf(blocks, 'contacts_bar')
  const header = payloadOf(blocks, 'header')
  const footer = payloadOf(blocks, 'footer')

  const pick = (field) =>
    stringField(contacts[field]) ||
    stringField(header[field]) ||
    stringField(footer[field])

  const logo = stringField(header.logo) || '/images/logo.webp'
  const buttonLink = stringField(header.button_link) || '/contacts'

  return {
    phone: pick('phone'),
    email: pick('email'),
    map: stringField(footer.map),
    logo,
    buttonLink,
    footerPayload: footer,
  }
}

export function socialLinks(footerPayload) {
  const data = footerPayload || {}
  return [
    { name: 'Facebook', url: data.facebook },
    { name: 'Instagram', url: data.instagram },
    { name: 'LinkedIn', url: data.linkedin },
  ].filter((item) => stringField(item.url))
}

const UiBlocksContext = createContext(null)

function useUiBlocksState() {
  const [blocks, setBlocks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    setError(false)

    api
      .get('/api/ui-blocks/')
      .then((res) => {
        if (!active) return
        const list = asBlockList(res.data)
        if (!list) {
          setError(true)
          setBlocks([])
          return
        }
        setBlocks(list)
      })
      .catch(() => {
        if (!active) return
        setError(true)
        setBlocks([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  const channels = useMemo(() => contactChannels(blocks), [blocks])
  const socials = useMemo(() => socialLinks(channels.footerPayload), [channels])

  return { blocks, loading, error, channels, socials }
}

export function UiBlocksProvider({ children }) {
  const value = useUiBlocksState()
  return <UiBlocksContext.Provider value={value}>{children}</UiBlocksContext.Provider>
}

export function useUiBlocks() {
  const context = useContext(UiBlocksContext)
  if (!context) {
    throw new Error('useUiBlocks must be used within UiBlocksProvider')
  }
  return context
}
