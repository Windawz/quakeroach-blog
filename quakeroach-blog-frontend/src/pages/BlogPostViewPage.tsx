import { useNavigate, useParams } from "react-router-dom";
import { useBlogPost, useDeleteBlogPost } from "../lib/backend/queries";
import Container from "../components/Container";
import { AppError } from "../lib/errorHandling";
import BlogPostFullView from "../components/BlogPostFullView";
import { useAuth } from "../lib/backend/useAuth";

export default function BlogPostViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { getAuthInfo } = useAuth();

  const blogPostId = Number(params.blogPostId);

  const queryResult = useBlogPost({
    id: blogPostId,
  });

  const deleteController = useDeleteBlogPost();

  switch (queryResult.kind) {
    case "error":
      if (queryResult.status === 404) {
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
          <BlogPostFullView
            blogPost={queryResult.data}
            authInfo={getAuthInfo()}
            onDelete={() => {
              deleteController.execute({
                params: {
                  id: queryResult.data.id,
                },
              });
            }} />
        </div>
      );
  }
}