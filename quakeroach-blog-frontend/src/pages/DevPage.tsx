import moment from "moment";
import { BlogPostOutput, getBackend } from "../globals/backend";
import { envars } from "../globals/envars";
import { useEffect, useState } from "react";

export default function DevPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPostOutput[] | undefined>(undefined);

  useEffect(() => {
    getBackend().blogPosts.getMany(10, moment('2024-01-01'))
      .then(x => {
        setBlogPosts(x);
      });
  }, [blogPosts?.length]);

  return (
    <div className='dev-page'>
      <div className='box'>
        Environment: {process.env.NODE_ENV}
      </div>
      <div className='box'>
        Api base url: {envars.baseApiUrl}
      </div>
      <div className='box'>
        Blog post count: {blogPosts?.length ?? 'undefined'}
      </div>
      {blogPosts?.map(x => (
        <div className='box'>
          {x.title}
        </div>
      ))}
    </div>
  );
}