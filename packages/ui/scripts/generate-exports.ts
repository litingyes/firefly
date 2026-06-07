import { readdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const srcDir = join(__dirname, '../src')
const indexPath = join(srcDir, 'index.ts')

const EXPORT_PATTERNS = [
  /^export\s+(?:type\s+)?(?:const|function|class|enum|interface|type)\s+(\w+)/gm,
  /^export\s+\{\s*([^}]+)\s*\}/gm,
]

function collectExportNames(content: string) {
  const names = new Set<string>()

  for (const pattern of EXPORT_PATTERNS) {
    pattern.lastIndex = 0
    let match: RegExpExecArray | null
    while ((match = pattern.exec(content)) !== null) {
      if (pattern.source.includes('\\{')) {
        for (const part of match[1].split(',')) {
          const name = part
            .trim()
            .split(/\s+as\s+/)
            .pop()
            ?.trim()
          if (name) names.add(name)
        }
      } else {
        names.add(match[1])
      }
    }
  }

  return names
}

async function scanComponentExports(relativeDir: string) {
  const dir = join(srcDir, relativeDir)
  const files = (await readdir(dir)).filter((file) => file.endsWith('.tsx')).sort()

  const exportsByFile = []

  for (const file of files) {
    const content = await readFile(join(dir, file), 'utf8')
    exportsByFile.push({
      file,
      names: collectExportNames(content),
      importPath: `./${relativeDir}/${file.replace(/\.tsx$/, '')}`,
    })
  }

  return exportsByFile
}

function detectConflicts(groups: Array<{ file: string; names: Set<string> }>) {
  const seen = new Map<string, string>()
  const conflicts: string[] = []

  for (const { file, names } of groups) {
    for (const name of names) {
      if (seen.has(name)) {
        conflicts.push(`${name} (${seen.get(name)} vs ${file})`)
      } else {
        seen.set(name, file)
      }
    }
  }

  return conflicts
}

async function main() {
  const uiExports = await scanComponentExports('components/ui')
  const aiExports = await scanComponentExports('components/ai-elements')
  const conflicts = detectConflicts([...uiExports, ...aiExports])

  if (conflicts.length > 0) {
    console.error('Export name conflicts detected:')
    for (const conflict of conflicts) {
      console.error(`  - ${conflict}`)
    }
    process.exit(1)
  }

  const lines = [
    '// AUTO-GENERATED — run pnpm generate:exports',
    '',
    ...uiExports.map(({ importPath }) => `export * from '${importPath}'`),
    ...aiExports.map(({ importPath }) => `export * from '${importPath}'`),
    "export * from './lib/utils'",
    "export * from './hooks/use-mobile'",
    '',
  ]

  await writeFile(indexPath, lines.join('\n'))
  console.log(`Generated ${indexPath} with ${uiExports.length + aiExports.length + 2} exports`)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
