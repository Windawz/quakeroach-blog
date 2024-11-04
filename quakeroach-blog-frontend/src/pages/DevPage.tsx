import moment from "moment";
import { BlogPostOutput, getBackend } from "../lib/backend";
import { envars } from "../lib/envars";
import { useEffect, useState } from "react";
import { forwardErrors } from "../lib/errorHandling";
import { useAuth, useAuthDispatch } from "../hooks/auth";

export default function DevPage() {
  const [blogPosts, setBlogPosts] = useState<BlogPostOutput[] | undefined>(undefined);
  const [error, setError] = useState<unknown | undefined>(undefined);
  const auth = useAuth();
  const authDispatch = useAuthDispatch();

  useEffect(() => {
    forwardErrors(setError, async () => {
      setBlogPosts(await getBackend().blogPosts.getMany(10, moment('2024-01-01')));
    });
  }, [blogPosts?.length]);
  
  if (error !== undefined) {
    throw error;
  }

  useEffect(() => authDispatch({ kind: "authenticate", userName: "Windawz" }), [authDispatch]);

  return (
    <div className='dev-page'>
      <div className='box'>
        Environment: {process.env.NODE_ENV}
      </div>
      <div className='box'>
        Api base url: {envars.baseApiUrl}
      </div>
      <div className='box'>
        Auth status: {JSON.stringify(auth)}
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