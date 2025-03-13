// app/edit-post/[postId]/page.tsx (서버 컴포넌트)
import PostEditor from "@/components/post-editor";

export default function EditPostPageWrapper({
  params,
}: {
  params: { postId: string };
}) {
  return <PostEditor postId={params.postId} />;
}
