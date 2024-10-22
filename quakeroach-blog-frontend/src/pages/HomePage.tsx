import './HomePage.css'
import BlogPost from '../components/BlogPost';
import moment from 'moment';
import { backend, BlogPostOutput } from '../globals/backend';
import { useEffect, useState } from 'react';
import { BackendError } from '../errors/BackendError';
import AppError from '../errors/AppError';
import { handleError } from '../errors/errorCatching';

export default function HomePage() {
  const [blogPosts, setBlogPosts] = useState<BlogPostOutput[]>([]);
  const [error, setError] = useState<AppError | undefined>(undefined);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await backend.blogPosts.getMany(10, moment('2024-01-01'));
        setBlogPosts(data);
      } catch (e) {
        handleError(e, BackendError, e => {
          setError(e);
        });
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
          id={666}
          authorName='Unknown'
          title={x.title}
          publishDate={x.publishDate}
          content={x.content} />
      ))}
    </div>
  );
}