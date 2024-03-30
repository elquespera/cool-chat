import { attachmentDir } from "@/constants";
import { routes } from "@/constants/routes";
import { existsSync } from "fs";
import { appendFile, mkdir, unlink } from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";

export async function createAttachment(file?: File): Promise<string | null> {
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

export async function removeAttachment(url: string) {
  try {
    const segments = url.split("/");
    const fileName = segments[segments.length - 1];
    console.log(fileName);

    await unlink(path.join(attachmentDir, fileName));
  } catch (error) {
    console.error(error);
  }
}
