/** @jsxRuntime classic /
/**@jsx jsx */
import {jsx} from '@emotion/react'
import Link from 'next/link'
import Image from 'next/image'
import Markdown from 'react-markdown'

export function BlogPostCard({blog: {title, slug, description}}) {
  return (
    <div
      css={{
        width: '320px',
        margin: '30px',
        background: 'white',
        padding: '30px',
        position: 'relative',
        boxShadow: '0px 1px 3px rgb(0 0 0 / 10%)',
      }}
    >
      <Link href={`/blog/${slug}`}>
        <a
          href="/"
          css={{
            textDecoration: 'none',
            color: 'black',
            '&:hover': {
              color: 'rgb(87, 62, 222)',
              textDecoration: 'none',
              ' > h2': {
                color: 'black',
              },
            },
          }}
        >
          <h2>{title}</h2>
        </a>
      </Link>
    </div>
  )
}
