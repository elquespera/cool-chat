import { appendFile, mkdir } from "fs/promises";
import { existsSync } from "fs";
import { nanoid } from "nanoid";
import path from "path";

const attachmentFolder = "attachments";

export async function saveFile(file?: File) {
  if (!file) return;

  try {
    const fileName = path.format({
      name: nanoid(15),
      ext: path.parse(file.name).ext,
    });

    const dirName = path.join(process.cwd(), "public", attachmentFolder);
    if (!existsSync(dirName)) {
      await mkdir(dirName);
    }

    const data = await file.arrayBuffer();

    await appendFile(path.join(dirName, fileName), Buffer.from(data));

    return `/${attachmentFolder}/${fileName}`;
  } catch (error) {
    console.error(error);
  }
}
