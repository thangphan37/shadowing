const path = require('path')
const fs = require('fs')
const inquirer = require('inquirer')
const mkdirp = require('mkdirp')
const jsToYaml = require('json-to-pretty-yaml')
const prettier = require('prettier')
const {formatDate} = require('./format-date')

require('dotenv').config({
  path: path.join(__dirname, '.env'),
})

const fromRoot = (...p) => path.join(__dirname, '..', ...p)

const listify = (a) =>
  a && a.trim().length
    ? a
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
    : null

async function generateBlogPost() {
  const {date, vocabularies} = await inquirer.prompt([
    {
      type: 'date',
      name: 'date',
      message: 'Shadowing date',
    },
    {
      type: 'input',
      name: 'vocabularies',
      message: 'Vocabularies (comma separated)',
    },
  ])

  const shadowingDate = formatDate(date ? new Date(date) : new Date())
  const slug = shadowingDate
  const destination = fromRoot('content/blog', slug)
  mkdirp.sync(destination)

  const audioDestination = fromRoot('public', slug)
  mkdirp.sync(audioDestination)

  const yaml = jsToYaml.stringify(
    removeEmpty({
      slug,
      title: shadowingDate,
      date: shadowingDate,
      author: 'Phan Cong Thang',
      vocabularies: listify(vocabularies),
    }),
  )
  console.log('yaml', yaml)
  const markdown = prettier.format(`---\n${yaml}\n---\n`, {
    ...require('./pettier-config'),
    parser: 'mdx',
  })
  fs.writeFileSync(path.join(destination, 'en.mdx'), markdown)
  console.log(`${destination.replace(process.cwd(), '')} is all ready for you`)
}

function removeEmpty(obj) {
  return Object.entries(obj).reduce(
    (o, [key, value]) => (value ? (o[key] = value) : void 0, o),
    {},
  )
}

generateBlogPost()
