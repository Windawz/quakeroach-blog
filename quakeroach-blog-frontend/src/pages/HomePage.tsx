import './HomePage.css'
import BlogPost from '../components/BlogPost';
import moment from 'moment';
import { BlogPostOutput, getBackend } from '../globals/backend';
import { useEffect, useState } from 'react';

export default function HomePage() {
  const [blogPosts, setBlogPosts] = useState<BlogPostOutput[]>([]);
  const [error, setError] = useState<unknown | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getBackend().blogPosts.getMany(10, moment('2024-01-01'));
        setBlogPosts(data);
      } catch (e) {
        setError(e);
      }
    };

    fetchData();
  }, []);

  if (error !== undefined) {
    throw error;
  }

  return (
    <div className="home-page">
      {blogPosts.map(x => (
        <BlogPost
          id={x.id}
          authorName='Unknown'
          title={x.title}
          publishDate={x.publishDate}
          content={x.content} />
      ))}
    </div>
  );
}