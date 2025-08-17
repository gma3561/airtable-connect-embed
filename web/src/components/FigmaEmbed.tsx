import { useEffect, useMemo, useState } from 'react'
import { useNavigate, useSearchParams, createSearchParams } from 'react-router-dom'
import { DEFAULT_FIGMA_URL } from '../config'

function normalizeFigmaEmbedUrl(raw: string): string | null {
  if (!raw) return null
  const trimmed = raw.trim()
  // If user pasted only a file key, build a file URL
  const fileKeyMatch = /^[A-Za-z0-9]{22,}$/
  if (fileKeyMatch.test(trimmed)) {
    const url = `https://www.figma.com/file/${trimmed}`
    return `https://www.figma.com/embed?embed_host=astra&url=${encodeURIComponent(url)}`
  }
  // If full figma URL
  if (trimmed.startsWith('http')) {
    // Accept both file and prototype URLs as-is
    return `https://www.figma.com/embed?embed_host=astra&url=${encodeURIComponent(trimmed)}`
  }
  return null
}

export default function FigmaEmbed() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const defaultUrl = (import.meta.env.VITE_FIGMA_URL as string | undefined) ?? DEFAULT_FIGMA_URL
  const initial = params.get('url') ?? defaultUrl ?? ''
  const [input, setInput] = useState<string>(initial)

  const embedUrl = useMemo(() => normalizeFigmaEmbedUrl(params.get('url') ?? defaultUrl ?? ''), [params, defaultUrl])

  useEffect(() => {
    // Keep input in sync when URL param changes externally
    const current = params.get('url') ?? defaultUrl ?? ''
    if (current !== input) setInput(current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params])

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const next = input.trim()
    const sp = createSearchParams(next ? { url: next } : {})
    navigate({ pathname: '/figma', search: `?${sp.toString()}` }, { replace: false })
  }

  return (
    <div className="card p-4">
      <div className="mb-3">
        <h2 className="text-lg font-semibold text-gray-900">Figma 임베드</h2>
        <p className="text-sm text-gray-600 mt-1">Figma 파일 또는 프로토타입 URL을 붙여넣거나, 파일 키만 입력해 보세요.</p>
      </div>
      <form onSubmit={onSubmit} className="flex items-center gap-2 mb-4">
        <input
          className="input-field"
          placeholder="https://www.figma.com/file/FILE_KEY 또는 전체 URL"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="btn-primary">열기</button>
      </form>
      {embedUrl ? (
        <div className="w-full" style={{ height: '70vh' }}>
          <iframe
            title="Figma Embed"
            className="w-full h-full rounded-md border"
            src={embedUrl}
            allowFullScreen
          />
        </div>
      ) : (
        <div className="text-sm text-gray-500">URL을 입력하면 이 영역에 미리보기가 표시됩니다.</div>
      )}
    </div>
  )
}


