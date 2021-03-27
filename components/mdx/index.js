/** @jsxRuntime classic /
/**@jsx jsx */

import {jsx} from '@emotion/react'
import {rhythm} from '../typography'
import {SmallTitle} from './small-title'
import {Title} from './title'
import {MediumTitle} from './medium-title'
import {Paragraph} from './paragraph'
import {List} from './list'
import slugify from '@sindresorhus/slugify'

import Highlight, {defaultProps} from 'prism-react-renderer'
import theme from 'prism-react-renderer/themes/nightOwl'
import * as mq from '../../styles/media-queries'

function Code({codeString, language}) {
  return (
    <Highlight
      {...defaultProps}
      theme={theme}
      code={codeString}
      language={language}
    >
      {({className, style, tokens, getLineProps, getTokenProps}) => (
        <div
          css={{
            overflow: 'auto',
            marginLeft: '-20px',
            marginRight: '-20px',
            [mq.large]: {
              marginLeft: '-80px',
              marginRight: '-80px',
            },
          }}
        >
          <pre
            className={className}
            style={style}
            css={{
              margin: '1em 0',
              padding: '0.5em',
            }}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({line, key: i})}>
                <span
                  css={{
                    display: 'inline-block',
                    width: '2em',
                    userSelect: 'none',
                    opacity: 0.5,
                  }}
                >
                  {i + 1}
                </span>
                <span>
                  {line.map((token, key) => (
                    <span key={key} {...getTokenProps({token, key})} />
                  ))}
                </span>
              </div>
            ))}
          </pre>
        </div>
      )}
    </Highlight>
  )
}
export default {
  wrapper: ({children}) => children,
  h1: (props) => <Title {...props} />,
  h2: (props) => <MediumTitle {...props} />,
  h3: (props) => <SmallTitle {...props} />,
  p: (props) => <Paragraph {...props} />,
  ul: (props) => <List {...props} />,
  pre: (preProps) => {
    const props = calculatePropsCode(preProps)

    if (props) {
      return <Code {...props} />
    } else {
      return <pre {...preProps} />
    }
  },
}

function calculatePropsCode(preProps) {
  const childrenProps = preProps?.children?.props

  if (childrenProps && childrenProps.mdxType === 'code') {
    const {children: codeString, className, ...otherProps} = childrenProps
    const matches = className.match(/language-(?<lang>.*)/)
    const language = matches?.groups?.lang ?? ''

    return {
      codeString: codeString.trim(),
      language,
      className,
      ...otherProps,
    }
  }
}
