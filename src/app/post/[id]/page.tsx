import { Suspense } from "react";
import { Navbar } from "@/components/navbar";
import { PostView } from "@/components/post-view";
import { PostViewSkeleton } from "@/components/post-view-skeleton";
import { GetServerSideProps } from "next";

interface PostPageProps {
  params: { id: string };
}

export default function PostPage({ params }: PostPageProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 container py-6 md:py-12">
        <Suspense fallback={<PostViewSkeleton />}>
          <PostView id={params.id} />
        </Suspense>
      </main>
    </div>
  );
}

// 🔹 Next.js가 `params`를 미리 생성하도록 설정
export async function generateStaticParams() {
  return [
    { id: "1" },
    { id: "2" },
    { id: "3" },
  ];
}
