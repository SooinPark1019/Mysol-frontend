import PostEditor from "@/components/post-editor";

export default function EditPostPageWrapper({ params }: { params: any }) {
  return <PostEditor postId={params.postId} />;
}
