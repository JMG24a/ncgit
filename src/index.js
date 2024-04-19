#!/home/jmg24king/.nvm/versions/node/v18.17.0/bin/node
import pc from 'picocolors';
import fsp /* fsp -> fileSystemPromises */ from 'node:fs/promises';
import fs /* fsp -> fileSystemPromises */ from 'node:fs';
import path from 'node:path'

const folder = process.argv ?? '.'
const actions = new Set(['start','add','status','commit','log', 'branch', 'checkout']);

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

function getId(max) {
  return Math.floor(Math.random() * max);
}

async function main () {
  const root = process.cwd();
  const sep = path.sep
  const action = folder[2];
  const flat = folder[3];
  const flat2 = folder[4] ?? null;


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

    const initialBranch = [{
      "name": "master",
      "staging": []
    }]


    await fsp.mkdir(`${root}${sep}.ncgit`, { recursive: true })
    await fsp.writeFile(`${root}${sep}.ncgit${sep}db.json`, '[]', 'utf-8')
    await fsp.writeFile(`${root}${sep}.ncgit${sep}branch.json`, JSON.stringify(initialBranch), 'utf-8')
    await fsp.writeFile(`${root}${sep}.ncgit${sep}staging.json`, '[]', 'utf-8')


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
      let stagingResult = JSON.parse(stagingJson)

      const status = {
        name: flat,
        author: 'jose',
        content: contentResult,
        commit: false,
        date: new Date()
      }

      stagingResult.forEach((element) => {
        if(element.name === flat){
          stagingResult = stagingResult.filter(item => item.name !== flat)
        }
      })

      stagingResult.push(status)
      const json = JSON.stringify(stagingResult)

      await fsp.writeFile(`${root}${sep}.ncgit${sep}staging.json`, json, 'utf-8')
      process.exit(0)
    }
  }

  if(action === 'status'){
    let stagingJson
    try{
      stagingJson = await fsp.readFile(`${root}${sep}.ncgit${sep}staging.json`)
    }catch{
      console.log(pc.yellow("you need starting ncgit"))
      process.exit(1)
    }
    const stagingResult = JSON.parse(stagingJson)

    const stagings = stagingResult.map(item => (item.name))
    stagings.push('.ncgit')
    const files = await ls(root)
    const uniqueInArray = files.filter(item => !stagings.includes(item));

    console.log('files without Tracking: ')
    uniqueInArray.map(item => console.log('no tracking: ',pc.red(item)))

    console.log('files with Tracking: ')
    stagingResult.map(async (item) => {
      const content = await fsp.readFile(`./${item.name}`, 'utf-8');
      if(item.content !== content){
        console.log('modified: ', pc.blue(item.name))
      }
      if(item.content === content && !item.commit){
        console.log('without changes: ', pc.green(item.name))
      }
    })
  }

  if(action === 'commit'){
    if(!flat){
      console.error(pc.yellow('you need add a commentary: '), 'ncgit commit "<commentary>"')
      process.exit(1)
    }

    let stagingJson
    let branchJson

    try{
      stagingJson = await fsp.readFile(`${root}${sep}.ncgit${sep}staging.json`, 'utf8')
    }
    catch{
      console.log(pc.yellow("you need starting ncgit"))
      process.exit(1)
    }

    try{
      branchJson = await fsp.readFile(`${root}${sep}.ncgit${sep}branch.json`, 'utf8')
      branchJson = JSON.parse(branchJson)
    }
    catch{
      console.log(pc.yellow("you need starting ncgit"))
      process.exit(1)
    }

    let stagingResult = JSON.parse(stagingJson)

    const branch = branchJson[branchJson.length -1]

    const commitJson = await fsp.readFile(`${root}${sep}.ncgit${sep}db.json`, 'utf8')
    let commitResult = JSON.parse(commitJson)

    let change = []
    const commit = stagingResult.map(item => {
      change.push(item.commit)
      item.commit = true
      return item
    })

    if(!change.includes(false)){
      console.log(pc.yellow('There are no changes to commit'))
      process.exit(0)
    }

    const commitStagingJson = JSON.stringify(commit)
    branchJson[branchJson.length -1].staging = commit

    await fsp.writeFile(`${root}${sep}.ncgit${sep}staging.json`, commitStagingJson, 'utf-8')
    await fsp.writeFile(`${root}${sep}.ncgit${sep}branch.json`, JSON.stringify(branchJson), 'utf-8')


    const status = {
      id: `${getId(3000)}-${new Date().getTime()}`,
      comment: flat,
      author: 'jose',
      branch: branch.name,
      changes: commit,
      date: new Date()
    }

    commitResult.push(status)
    const json = JSON.stringify(commitResult)

    await fsp.writeFile(`${root}${sep}.ncgit${sep}db.json`, json, 'utf-8')
    console.log(pc.green('commit successful'))
    process.exit(0)
  }

  if(action === 'log'){
    let commitJson

    try{
      commitJson = await fsp.readFile(`${root}${sep}.ncgit${sep}db.json`, 'utf8')
    }
    catch{
      console.log(pc.yellow("you need starting ncgit"))
      process.exit(1)
    }
    let commitResult = JSON.parse(commitJson)

    const logs = commitResult.map(item => {
      const files = item.changes.map(i => i.name)
      const log = {
        id: item.id,
        branch: item.branch,
        commit: item.comment,
        author: item.author,
        date: item.date,
        changes: files
      }
      return log;
    }).reverse()

    console.log('Logs: ', pc.green('previous commits: '))
    console.log(...logs)
    process.exit(0)
  }

  const listBranch = async ()=>{
    let jsonBranches = [];
    try {
      const branches = await fsp.readFile(`${root}${sep}.ncgit${sep}branch.json`, 'utf-8')
      jsonBranches = JSON.parse(branches)
    } catch {
      console.log('Error to read branches settings')
    }
    console.log(pc.yellow('list of branches:'))
    jsonBranches.map(item => console.log(item.name))
  }

  const removeBranch = async ()=>{
    if(flat2 == null){
      console.log(pc.yellow(`need branch name to rum`))
      process.exit(1)
    }
    let jsonBranches = [];
    try {
      const branches = await fsp.readFile(`${root}${sep}.ncgit${sep}branch.json`, 'utf-8')
      jsonBranches = JSON.parse(branches)
    } catch {
      console.log('Error to read branches settings')
    }
    const result = jsonBranches.filter(item => item.name != flat2)

    console.log(pc.gray(`branch ${flat2} removed`))

    await fsp.writeFile(`${root}${sep}.ncgit${sep}branch.json`, JSON.stringify(result), 'utf-8')
  }

  const createBranch = async (name) => {
    if(!name){
      console.log(pc.yellow("You need a branch name: "), "ncgit branch <name>")
      process.exit(1)
    }

    let jsonBranches = [];
    let jsonStaging = []

    try {
      const branches = await fsp.readFile(`${root}${sep}.ncgit${sep}branch.json`, 'utf-8')
      jsonBranches = JSON.parse(branches)
    } catch {
      console.log('Error to read branches settings')
      process.exit(1)
    }

    try {
      const stagings = await fsp.readFile(`${root}${sep}.ncgit${sep}staging.json`, 'utf-8')
      jsonStaging = JSON.parse(stagings)
    } catch {
      console.log('Error to read stagings settings')
      process.exit(1)
    }

    let isTrue = true
    jsonBranches.map(item => item.name.includes(name) ? isTrue = true : isTrue = false)

    if(isTrue){
      console.log(`the branch ${name} all ready exist`)
      process.exit(1)
    }

    const status = {
      name,
      staging: jsonStaging
    }

    jsonBranches.push(status)

    await fsp.writeFile(`${root}${sep}.ncgit${sep}branch.json`, JSON.stringify(jsonBranches), 'utf-8')
  }

  if(action === 'branch'){
    const options = {
      "-l": listBranch,
      "-r": removeBranch,
      "default": createBranch
    }

    if(options[flat]){
      options[flat]()
    }else{
      await options['default'](flat)
    }
  }

  if(action === 'checkout'){
    let jsonBranches = [];
    let jsonStaging = [];

    try {
      const branches = await fsp.readFile(`${root}${sep}.ncgit${sep}branch.json`, 'utf-8')
      jsonBranches = JSON.parse(branches)
    } catch {
      console.log('Error to read branches settings')
      process.exit(1)
    }

    if(!flat){
      console.log(pc.green('You are currently in the branch:'),jsonBranches[jsonBranches.length - 1].name)
      process.exit(0)
    }

    try {
      jsonStaging = await fsp.readFile(`${root}${sep}.ncgit${sep}staging.json`, 'utf-8')
      jsonStaging = JSON.parse(jsonStaging)
    } catch {
      console.log('Error to read staging settings')
      process.exit(1)
    }

    const branch = jsonBranches.filter(item => item.name === flat)

    if(branch.length == 0){
      console.log(pc.yellow('branch do not exist'))
      process.exit(1)
    }

    fs.readdir(root, async (error, files) => {
      if (error) {
        console.error('Error al leer el root:', error);
        return;
      }

      for (const file of files) {
        const rootFile = path.join(root, file);

        fs.unlink(rootFile, (error) => {
          if (error) {
            console.error('');
          } else {
            console.log('file removed:', rootFile);
          }
        });
      }

      const createFiles = branch[0].staging.map(async (item) => {
        await fsp.writeFile(`${root}${sep}${item.name}`, JSON.stringify(item.content), 'utf-8')
      })

      Promise.all(createFiles) .then(console.log('')) .catch('error files created');
    });



    const branches = jsonBranches.filter(item => item.name !== flat)

    const staging = branch[0].staging
    await fsp.writeFile(`${root}${sep}.ncgit${sep}staging.json`, JSON.stringify(staging), 'utf-8')


    branches.push(...branch)
    const branchesResult = branches;

    await fsp.writeFile(`${root}${sep}.ncgit${sep}branch.json`, JSON.stringify(branchesResult), 'utf-8')
  }
}

main()
