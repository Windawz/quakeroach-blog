import './styles/HomePage.css'
import BlogPostShortView from '../components/BlogPostShortView';
import { useBlogPosts } from '../lib/backend/queries';
import { AppError } from '../lib/errorHandling';
import { QueryResult } from '../lib/backend/apiHooks';
import { BlogPost } from '../lib/data/BlogPost';
import Container from '../components/Container';

export default function HomePage() {
  const queryResult = useBlogPosts({
    maxCount: 10,
  });

  let contents = getHomePageContents(queryResult);

  return (
    <div className="home-page">
      {contents}
    </div>
  );
}

function getHomePageContents(queryResult: QueryResult<BlogPost[]>): JSX.Element | JSX.Element[] {
  switch (queryResult.kind) {
    case "success":
      const blogPosts = queryResult.data;

      if (blogPosts.length === 0) {
        return (
          <Container>
            No blog posts to show
          </Container>
        );
      } else {
        return blogPosts.map(x => (
          <BlogPostShortView blogPost={x} />
        ));
      }
    case "pending":
      return (
        <Container>
          Pending...
        </Container>
      );
    case "error":
      throw new AppError({
        message: queryResult.message,
      });
  }
}