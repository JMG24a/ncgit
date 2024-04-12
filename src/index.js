#!/home/jmg24king/.nvm/versions/node/v18.17.0/bin/node
import pc from 'picocolors';
import fsp /* fsp -> fileSystemPromises */ from 'node:fs/promises';
import path from 'node:path'

const folder = process.argv ?? '.'
const actions = new Set(['start','add','status','commit','log']);

async function ls (folder) {
  let files = []
  try {
    files = await fsp.readdir(folder)
  } catch (error) {
    console.log('Error: ', error)
    process.exit(1)
  }
  return files;
}

async function main () {
  const root = process.cwd();
  const sep = path.sep
  const action = folder[2];
  const flat = folder[3];

  if(!actions.has(action)){
    console.log(`"${pc.red(action)}" command doesn't exist
    ${pc.yellow(`help:
        ${pc.white('ncgit start')}: initialized ncgit in project
        ${pc.white('ncgit add')}: add a file to the staging area
        ${pc.white('ncgit status')}: shows the current status of the repository
        ${pc.white('ncgit commit')}: Commit changes to the repository with a descriptive message
        ${pc.white('ncgit log')}: shows the history of commits in the repository`)}
    `)
  }

  if(action === 'start'){
    const files = await ls(root)
    if(files.includes('.ncgit')){
      console.error(`${pc.yellow('ncgit is already initialized')}`)
      process.exit(1)
    }
    await fsp.mkdir(`${root}${sep}.ncgit`, { recursive: true })
    await fsp.writeFile(`${root}${sep}.ncgit${sep}db.json`, '[]', 'utf-8')
    console.log(pc.green('project initialized in: '), root);
    process.exit(0)
  }

  if(action === 'add'){
    const files = await ls(root)
    if(!files.includes('.ncgit')){
      console.error(`${pc.yellow('you need start ncgit at the repository:')} ${pc.white('ncgit start')}`)
      process.exit(1)
    }

    if(!flat){
      console.log(`${pc.yellow('you need to add file:')} ${pc.white('ncgit add <file>')}`)
      process.exit(1)
    }

    if(!files.includes(flat)){
      console.log(`${pc.yellow("that file doesn't exist:")}`)
      process.exit(1)
    }else{
      const contentFlat = await fsp.readFile(`${root}${sep}${flat}`)
      const contentResult =  String.fromCharCode(...contentFlat)

      const stagingJson = await fsp.readFile(`${root}${sep}.ncgit${sep}staging.json`)
      const stagingResult = JSON.parse(stagingJson)

      const status = {
        author: 'jose',
        content: contentResult,
      }

      stagingResult.push(status)

      const json = JSON.stringify(stagingResult)

      await fsp.writeFile(`${root}${sep}.ncgit${sep}staging.json`, json, 'utf-8')
      process.exit(0)
    }
  }
}

main()
