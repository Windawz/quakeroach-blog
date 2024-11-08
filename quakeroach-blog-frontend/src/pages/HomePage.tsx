import './HomePage.css'
import BlogPost from '../components/BlogPost';
import moment from 'moment';
import { useQuery } from '../lib/backend/useQuery';

export default function HomePage() {
  const queryResult = useQuery({
    method: "get",
    url: "blogPosts",
    params: {
      maxCount: 10,
      minPublishDate: moment('2024-01-01').format(),
    },
  });

  let contents = undefined;

  switch (queryResult.kind) {
    case "success":
      const blogPosts = queryResult.data as any[];

      if (blogPosts.length === 0) {
        contents = (
          <div className="box">
            No blog posts to show
          </div>
        );
      } else {
        contents = (queryResult.data as any[]).map(x => (
        <BlogPost
          id={x.id}
          authorName={x.authorName}
          title={x.title}
          publishDate={x.publishDate}
          content={x.content} />
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
      contents = (
        <div className="box">
          An error has occured: {queryResult.message}
        </div>
      );
      break;
  }

  return (
    <div className="home-page">
      {contents}
    </div>
  );
}