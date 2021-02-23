import { useState, useEffect } from 'react';
import { API, Storage } from 'aws-amplify';
import { useRouter } from 'next/router';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import '../../configureAmplify';
import { listPosts, getPost } from '../../graphql/queries';

export default function Post({ post }) {
  const [coverImage, setCoverImage] = useState(null);
  useEffect(() => {
    updateCoverImage();
  }, []);

  async function updateCoverImage() {
    if (post.coverImage) {
      const imageKey = await Storage.get(post.coverImage);
      setCoverImage(imageKey);
    }
  }

  const router = useRouter();
  if (router.isFallback) {
    return <div>Loading...</div>;
  }
  return (
    <div>
      <h1 className="flex justify-between text-5xl mt-4 font-semibold tracking-wide">
        {post.title}{' '}
        <Link href={`/edit-post/${post.id}`}>
          <a
            className="flex items-center text-sm bg-blue-500 text-white font-semibold rounded-lg h-8 px-2"
            title="edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="w-4 inline text-white"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Edit
          </a>
        </Link>
      </h1>
      {coverImage && <img src={coverImage} className="mt-4" />}
      <p className="text-sm font-light my-4">by {post.username}</p>
      <div className="mt-8">
        <ReactMarkdown className="prose" children={post.content} />
      </div>
    </div>
  );
}

export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts,
  });
  const paths = postData.data.listPosts.items.map((post) => ({ params: { id: post.id } }));
  return {
    paths,
    fallback: true,
  };
}

export async function getStaticProps({ params }) {
  const { id } = params;
  const postData = await API.graphql({
    query: getPost,
    variables: { id },
  });
  return {
    props: {
      post: postData.data.getPost,
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 300, // adds Incremental Static Generation, sets time in seconds
  };
}
