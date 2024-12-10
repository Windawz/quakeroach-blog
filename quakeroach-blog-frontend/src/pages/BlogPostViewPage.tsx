import { useNavigate, useParams } from "react-router-dom";
import { useBlogPost } from "../lib/backend/queries";
import Container from "../components/Container";
import BlogPostFullView from "../components/BlogPostFullView";
import { useEffect } from "react";
import { CommandResult } from "../lib/backend/apiHooks";
import BlogPostCommentSection from "../components/BlogPostCommentSection";

export default function BlogPostViewPage() {
  const params = useParams();
  const navigate = useNavigate();

  const blogPostId = Number(params.blogPostId);
  const result = useBlogPost({
    id: blogPostId,
  });

  useEffect(() => {
    if (result.kind === "error" && result.status === 404) {
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const deleteResultHandler = (result: CommandResult<undefined>) => {
    if (result.kind === "success") {
      navigate("/home");
    }
  };

  switch (result.kind) {
    case "error":
      return (<></>);
    case "pending":
      return (
        <Container>
          Pending...
        </Container>
      );
    case "success":
      return (
        <div className="blog-post-view-page">
          <BlogPostFullView
            blogPost={result.data}
            deleteResultHandler={deleteResultHandler} />
          <BlogPostCommentSection />
        </div>
      );
  }
}