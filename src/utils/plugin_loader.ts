import { IImpl, PluginData } from '@src/types'
import { promises as fs } from 'fs'
import path from 'path'

async function loadImplFromPackageJson(): Promise<IImpl> {
  try {
    const packageJsonPath = path.join(process.cwd(), 'package.json')
    const packageJsonData = await fs.readFile(packageJsonPath, 'utf-8')
    const packageJson = JSON.parse(packageJsonData)
    const entryPoint = packageJson.main || './index.js'
    const entryPath = path.resolve(process.cwd(), entryPoint)
    const module = await import(entryPath)

    if (module.Impl) {
      return new module.Impl()
    } else {
      return new (class implements IImpl {
        plugins: PluginData[] = []
      })()
    }
  } catch (error: any) {
    throw new Error(
      `Failed to load Impl from user's package.json: ${error.message}`,
    )
  }
}

export { loadImplFromPackageJson }
