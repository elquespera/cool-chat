import { attachmentDir } from "@/constants";
import { getAuth } from "@/lib/auth/get-auth";
import { readFile } from "fs/promises";

import path from "path";

export const GET = async (
  _: Request,
  { params: { file } }: { params: { file: string } },
) => {
  const { user } = await getAuth();
  if (!user)
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
    });

  try {
    const filePath = path.join(attachmentDir, file);
    console.log(`Reading file ${filePath}`);

    const result = await readFile(filePath);

    return new Response(result, { status: 200 });
  } catch (error) {
    //@ts-ignore
    if (error.code === "ENOENT") {
      return new Response(
        JSON.stringify({ error: `File not found on server.` }),
        {
          status: 404,
        },
      );
    }

    return new Response(
      JSON.stringify({ error: `Failed to read file ${file}` }),
      {
        status: 500,
      },
    );
  }
};
