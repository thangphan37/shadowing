/** @jsxRuntime classic /
/**@jsx jsx */

import {jsx} from '@emotion/react'
import Image from 'next/image'
import Head from 'next/head'
import Markdown from 'react-markdown'
import Layout from '../../components/layout'
import {getAllBlogIds, getBlogData} from '../../lib/blog'
import {Toggle, useToggle} from '../../components/toggle'
import * as React from 'react'

function Main({blog: {title, slug, content}}) {
  const {lang, status} = useToggle()

  if (status === 'idle' || status === 'pending') {
    return <p>Loading...</p>
  }

  return (
    <>
      <audio
        src={`/${title}/${lang}.m4a`}
        controls
        autoPlay
        css={{
          marginBottom: '1.5em',
        }}
      />
      <div dangerouslySetInnerHTML={{__html: content[lang]}} />
    </>
  )
}

export default function Blog({blog}) {
  return (
    <Layout
      css={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px',
      }}
    >
      <Head>
        <title>{blog.title}</title>
      </Head>
      <Main blog={blog} />
    </Layout>
  )
}

export function getStaticPaths() {
  const paths = getAllBlogIds()

  return {
    paths,
    fallback: false,
  }
}

export async function getStaticProps({params}) {
  const blog = await getBlogData(params.id)
  return {
    props: {
      blog,
    },
  }
}
