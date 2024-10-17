import './HomePage.css'
import BlogPostPreview from '../components/BlogPostPreview';
import moment from 'moment';

export default function HomePage() {
  return (
    <div className="home-page">
      <BlogPostPreview
        id={666}
        title='My Blog Post'
        authorName='Windawz'
        publishDate={moment('2024-10-11')}
        content={'This is my blog\'s content. Very interesting stuff, I know.'} />
      <BlogPostPreview
        id={666}
        title='My Blog Post'
        authorName='Windawz'
        publishDate={moment('2024-10-11')}
        content={'This is my blog\'s content. Very interesting stuff, I know.'} />
      <BlogPostPreview
        id={666}
        title='My Blog Post'
        authorName='Windawz'
        publishDate={moment('2024-10-11')}
        content={'This is my blog\'s content. Very interesting stuff, I know. This is my blog\'s content. Very interesting stuff, I know. This is my blog\'s content. Very interesting stuff, I know. This is my blog\'s content. Very interesting stuff, I know. This is my blog\'s content. Very interesting stuff, I know. This is my blog\'s content. Very interesting stuff, I know.'} />
      <BlogPostPreview
        id={666}
        title='My Blog Post'
        authorName='Windawz'
        publishDate={moment('2024-10-11')}
        content={'This is my blog\'s content. Very interesting stuff, I know.'} />
      <BlogPostPreview
        id={666}
        title='My Blog Post'
        authorName='Windawz'
        publishDate={moment('2024-10-11')}
        content={'This is my blog\'s content. Very interesting stuff, I know.'} />
      <BlogPostPreview
        id={666}
        title='My Blog Post'
        authorName='Windawz'
        publishDate={moment('2024-10-11')}
        content={'This is my blog\'s content. Very interesting stuff, I know.'} />
    </div>
  );
}