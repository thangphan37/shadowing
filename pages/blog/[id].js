/** @jsxRuntime classic /
/**@jsx jsx */

import {jsx} from '@emotion/react'
import Image from 'next/image'
import Head from 'next/head'
import Markdown from 'react-markdown'
import * as React from 'react'

import {getAllBlogIds, getBlogData} from '../../lib/blog'
import Layout from '../../components/layout'

export default function Blog({
  blog: {title, slug, bannerCredit, content, description},
}) {
  return (
    <Layout
      css={{
        maxWidth: '800px',
        margin: '0 auto',
        padding: '40px',
      }}
    >
      <Head>
        <title>{title}</title>
      </Head>
      <audio
        src={`/${title}/jp.m4a`}
        controls
        autoPlay
        css={{
          marginBottom: '1.5em',
        }}
      />
      <div dangerouslySetInnerHTML={{__html: content}} />
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
