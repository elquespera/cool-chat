import { attachmentDir } from "@/constants";
import { routes } from "@/constants/routes";
import { existsSync } from "fs";
import { appendFile, mkdir } from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

export async function saveFile(file?: File): Promise<string | null> {
  if (!file) return null;

  try {
    const fileName = path.format({
      name: nanoid(15),
      ext: path.parse(file.name).ext,
    });

    if (!existsSync(attachmentDir)) {
      await mkdir(attachmentDir);
    }

    const data = await file.arrayBuffer();

    await appendFile(path.join(attachmentDir, fileName), Buffer.from(data));

    return `${routes.attachments}/${fileName}`;
  } catch (error) {
    console.error(error);
  }

  return null;
}
