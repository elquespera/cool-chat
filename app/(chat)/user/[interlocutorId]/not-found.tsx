import { NotFound } from "@/components/common/not-found";

export default function NotFoundPage() {
  return (
    <NotFound title="User Not Found">{`The user you're looking for was not found on the server.`}</NotFound>
  );
}
