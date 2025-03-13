// app/edit-post/[postId]/page.tsx (서버 컴포넌트)
import PostEditor from "@/components/post-editor";

export default async function EditPostPageWrapper({
  params,
}: {
  params: { postId: string } | Promise<{ postId: string }>;
}) {
  // params가 Promise가 아니더라도 Promise.resolve()를 사용해 Promise로 감싸줍니다.
  const resolvedParams = await Promise.resolve(params as Promise<{ postId: string }>);
  return <PostEditor postId={resolvedParams.postId} />;
}
