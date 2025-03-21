import * as path from "path";
import { promises as fs } from "fs";

const esmSourceDir = path.resolve("node_modules/@libmedia/avplayer/dist/esm");
const destDir = path.resolve("dist/assets");

export async function copyLibmediaSrc() {
  await copyFiles(esmSourceDir, destDir);
}

export async function copyFiles(src: string, dest: string) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyFiles(srcPath, destPath);
    } else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

copyLibmediaSrc();
