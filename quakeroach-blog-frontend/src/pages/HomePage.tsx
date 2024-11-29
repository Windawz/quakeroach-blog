import './styles/HomePage.css'
import BlogPostShortView from '../components/BlogPostShortView';
import moment from 'moment';
import { useBlogPosts } from '../lib/backend/queries';
import { AppError } from '../lib/errorHandling';

export default function HomePage() {
  const queryResult = useBlogPosts({
    maxCount: 10,
    minPublishDate: moment('2024-01-01'),
  });

  let contents = undefined;

  switch (queryResult.kind) {
    case "success":
      const blogPosts = queryResult.data;

      if (blogPosts.length === 0) {
        contents = (
          <div className="box">
            No blog posts to show
          </div>
        );
      } else {
        contents = blogPosts.map(x => (
          <BlogPostShortView blogPost={x} />
        ));
      }
      break;
    case "pending":
      contents = (
        <div className="box">
          Pending...
        </div>
      );
      break;
    case "error":
      throw new AppError({
        message: queryResult.message,
      });
  }

  return (
    <div className="home-page">
      {contents}
    </div>
  );
}