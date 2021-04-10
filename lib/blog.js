import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import renderToString from 'next-mdx-remote/render-to-string'
import mdxComponents from '../components/mdx'

const blogsDirectory = path.join(process.cwd(), 'content/blog')
const filePaths = {
  jp: 'jp.mdx',
  en: 'en.mdx',
}

export function getSortedBlogsData() {
  const blogNames = fs
    .readdirSync(blogsDirectory)
    .map((name) => path.join(blogsDirectory, name))
    .filter((directory) => fs.lstatSync(directory).isDirectory())

  const blogsJp = composeBlogs(blogNames, filePaths.jp)
  const blogsEn = composeBlogs(blogNames, filePaths.en)

  return {
    jp: sortBlogs(blogsJp),
    en: sortBlogs(blogsEn),
  }
}

export function getAllBlogIds() {
  const blogNames = fs
    .readdirSync(blogsDirectory)
    .map((name) => name)
    .filter((directory) =>
      fs.lstatSync(path.join(blogsDirectory, directory)).isDirectory(),
    )

  return blogNames.map((fileName) => {
    return {
      params: {id: fileName},
    }
  })
}

export async function getBlogData(id) {
  const {content: jp, matterResult} = await composeBlogData(
    `${id}/${filePaths.jp}`,
  )
  const blogEn = await composeBlogData(`${id}/${filePaths.en}`)
  const content = {jp}

  if (blogEn) {
    content.en = blogEn.content
  }

  return {
    id,
    content,
    ...matterResult.data,
  }
}

function sortBlogs(blogs) {
  return blogs.sort((a, b) => (a.date < b.date ? 1 : -1))
}

function composeBlogs(blogNames, filePath) {
  return blogNames
    .map((directoryName) => {
      const fullPath = path.join(directoryName, filePath)

      if (fs.existsSync(fullPath)) {
        const fileContents = fs.readFileSync(fullPath, 'utf-8')
        const matterResult = matter(fileContents)

        return matterResult.data
      }
    })
    .filter((e) => e)
}

async function composeBlogData(filePath) {
  const fullPath = path.join(blogsDirectory, filePath)

  if (fs.existsSync(fullPath)) {
    const fileContents = fs.readFileSync(fullPath, 'utf-8')
    const matterResult = matter(fileContents)
    const {renderedOutput} = await getContentString(matterResult)

    return {
      content: renderedOutput,
      matterResult,
    }
  }
}

async function getContentString(matterResult) {
  return await renderToString(matterResult.content, {
    components: mdxComponents,
  })
}
