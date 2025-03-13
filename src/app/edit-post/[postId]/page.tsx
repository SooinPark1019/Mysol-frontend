// app/edit-post/[postId]/page.tsx (서버 컴포넌트)
import PostEditor from "@/components/post-editor";

export default async function EditPostPageWrapper({
  params,
}: {
  // params가 Promise일 수도 있으므로 union 타입으로 처리합니다.
  params: { postId: string } | Promise<{ postId: string }>;
}) {
  // params가 Promise가 아닐 경우 await는 즉시 resolve됩니다.
  const { postId } = await params;
  return <PostEditor postId={postId} />;
}
