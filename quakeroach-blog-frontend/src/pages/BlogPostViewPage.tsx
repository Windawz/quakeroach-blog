import { useNavigate, useParams } from "react-router-dom";
import { useBlogPost, useDeleteBlogPost } from "../lib/backend/queries";
import Container from "../components/Container";
import BlogPostFullView from "../components/BlogPostFullView";
import { useAuth } from "../lib/backend/useAuth";
import { useEffect } from "react";

export default function BlogPostViewPage() {
  const params = useParams();
  const navigate = useNavigate();
  const { getAuthInfo } = useAuth();

  const blogPostId = Number(params.blogPostId);

  const queryResult = useBlogPost({
    id: blogPostId,
  });

  const deleteController = useDeleteBlogPost();

  useEffect(() => {
    if (queryResult.kind === "error" && queryResult.status === 404) {
      navigate("/");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryResult]);

  useEffect(() => {
    if (deleteController.result.kind === "success") {
      navigate("/home");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteController.result]);

  switch (queryResult.kind) {
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
            blogPost={queryResult.data}
            authInfo={getAuthInfo()}
            onDelete={() => {
              deleteController.execute({
                route: [queryResult.data.id],
                params: {},
                data: {},
              });
            }} />
        </div>
      );
  }
}