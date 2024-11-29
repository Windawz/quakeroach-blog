import { useNavigate, useParams } from "react-router-dom";
import { useBlogPost } from "../lib/backend/queries";
import Container from "../components/Container";
import { AppError } from "../lib/errorHandling";
import BlogPostShortView from "../components/BlogPostShortView";

export default function BlogPostViewPage() {
  const params = useParams();
  const navigate = useNavigate();

  const blogPostId = Number(params.blogPostId);

  const result = useBlogPost({
    id: blogPostId,
  });

  switch (result.kind) {
    case "error":
      if (result.status === 404) {
        navigate("");
        return (<></>);
      } else {
        throw new AppError({
          message: "Failed to get blog post to view",
        })
      }
    case "pending":
      return (
        <Container>
          Pending...
        </Container>
      );
    case "success":
      return (
        <div className="blog-post-view-page">
          <BlogPostShortView blogPost={result.data} />
        </div>
      );
  }
}