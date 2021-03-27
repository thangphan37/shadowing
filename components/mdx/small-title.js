/** @jsxRuntime classic /
/**@jsx jsx */

import {jsx} from '@emotion/react'
import styled from '@emotion/styled'
import {rhythm} from '../typography'
import slugify from '@sindresorhus/slugify'
import {PermaLink} from './permal-link'

export function SmallTitle({children}) {
  const title = children.props ? children.props.children : children
  const id = slugify(title)
  return (
    <h3
      id={id}
      css={{
        lineHeight: 1.5,
        textAlign: 'left',
        marginTop: rhythm(2),
        marginBottom: rhythm(1),
        fontSize: '1.4rem',
        position: 'relative',
      }}
    >
      <PermaLink id={id} />
      {children}
    </h3>
  )
}
