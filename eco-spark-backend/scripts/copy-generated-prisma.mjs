import { cp, mkdir, stat } from "node:fs/promises"
import path from "node:path"
import process from "node:process"

const root = process.cwd()
const sourceDir = path.join(root, "src", "generated")
const destinationDir = path.join(root, "dist", "generated")

const sourceExists = await stat(sourceDir)
  .then(() => true)
  .catch(() => false)

if (!sourceExists) {
  console.error("Missing Prisma generated output at src/generated. Run `npx prisma generate` before build.")
  process.exit(1)
}

await mkdir(destinationDir, { recursive: true })
await cp(sourceDir, destinationDir, { recursive: true, force: true })
