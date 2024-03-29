import { attachmentDir } from "@/constants";
import { readFile } from "fs/promises";

import path from "path";

export const GET = async (
  _: Request,
  { params: { file } }: { params: { file: string } },
) => {
  try {
    const filePath = path.join(process.cwd(), attachmentDir, file);
    console.log(`Reading file ${filePath}`);

    const result = await readFile(filePath);

    return new Response(result, { status: 200 });
  } catch (error) {
    console.log(String(error));
    new Response(JSON.stringify({ error: `Failed to read file ${file}` }), {
      status: 500,
    });
  }
};
