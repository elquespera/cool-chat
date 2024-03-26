import { NotFound } from "@/components/common/not-found";

export default function NotFoundPage() {
  return (
    <NotFound title="Chat Not Found">{`The chat you're looking for was not found on the server.`}</NotFound>
  );
}
