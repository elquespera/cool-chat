import { attachmentDir } from "@/constants";
import { routes } from "@/constants/routes";
import { existsSync } from "fs";
import { appendFile, mkdir, unlink, readFile } from "fs/promises";
import { nanoid } from "nanoid";
import path from "path";
import sharp from "sharp";

const imageMaxSize = 1200;

export async function createAttachment(
  file?: File,
  resize = false,
): Promise<string | null> {
  if (!file) return null;

  try {
    const fileName = path.format({
      name: nanoid(15),
      ext: path.parse(file.name).ext,
    });

    const filePath = path.join(attachmentDir, fileName);

    if (!existsSync(attachmentDir)) {
      await mkdir(attachmentDir, { recursive: true });
    }

    const data = await file.arrayBuffer();

    if (resize) {
      await sharp(data).resize(imageMaxSize).toFile(filePath);
    } else {
      await appendFile(filePath, Buffer.from(data));
    }

    return `${routes.attachments}/${fileName}`;
  } catch (error) {
    console.error(error);
  }

  return null;
}

export async function readAttachment(url: string) {
  try {
    const buffer = await readFile(getAttachmentPath(url));
    return [Buffer.from(buffer).toString("base64")];
  } catch (error) {
    console.error(error);
  }
}

export async function removeAttachment(url: string) {
  try {
    await unlink(getAttachmentPath(url));
  } catch (error) {
    console.error(error);
  }
}

function getAttachmentPath(attachmentURL: string) {
  const segments = attachmentURL.split("/");
  const fileName = segments[segments.length - 1];
  const filePath = path.join(attachmentDir, fileName);
  console.log(filePath);

  return filePath;
}
