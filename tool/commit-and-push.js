const {spawnSync} = require('child_process')
const {formatDate} = require('./format-date')

function commitAndPush() {
  const message = formatDate(new Date())
  console.log('adding...')
  spawnSync('git', ['add', '--all'], {
    stdio: 'inherit',
  })

  console.log(`committing: ${message}`)
  spawnSync('git', ['commit', '-m', message], {
    stdio: 'inherit',
  })
  console.log('pushing...')
  spawnSync('git', ['push'], {
    stdio: 'inherit',
  })
}

commitAndPush()
