import { useEffect } from 'react'

const SITE_NAME = 'データ活用・プライバシー炎上事例カタログ'
const DEFAULT_DESCRIPTION =
  'データ活用やプライバシーに関する炎上・トラブル事例を収集・整理・検索できるWebカタログ。過去の事例から学び、同様のトラブルを未然に防ぐための参考情報を提供します。'

interface PageMeta {
  title?: string
  description?: string
}

export function usePageMeta({ title, description }: PageMeta = {}) {
  useEffect(() => {
    document.title = title ? `${title} | ${SITE_NAME}` : SITE_NAME

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', description ?? DEFAULT_DESCRIPTION)
    }

    return () => {
      document.title = SITE_NAME
      if (meta) {
        meta.setAttribute('content', DEFAULT_DESCRIPTION)
      }
    }
  }, [title, description])
}
