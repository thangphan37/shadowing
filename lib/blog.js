import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import renderToString from 'next-mdx-remote/render-to-string'
import mdxComponents from '../components/mdx'

const blogsDirectory = path.join(process.cwd(), 'content/blog')

export function getSortedBlogsData() {
  const blogNames = fs
    .readdirSync(blogsDirectory)
    .map((name) => path.join(blogsDirectory, name))
    .filter((directory) => fs.lstatSync(directory).isDirectory())

  const allBlogsData = blogNames.map((directoryName) => {
    const fullPath = path.join(directoryName, 'en.mdx')
    const fileContents = fs.readFileSync(fullPath, 'utf-8')
    const matterResult = matter(fileContents)

    return matterResult.data
  })

  return allBlogsData.sort((a, b) => (a.date < b.date ? 1 : -1))
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
  const fullPath = path.join(blogsDirectory, `${id}/en.mdx`)
  const fileContents = fs.readFileSync(fullPath, 'utf-8')
  const matterResult = matter(fileContents)
  const {renderedOutput} = await renderToString(matterResult.content, {
    components: mdxComponents,
  })

  return {
    id,
    content: renderedOutput,
    ...matterResult.data,
  }
}
