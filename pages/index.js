import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API, Storage } from 'aws-amplify';
import { listPosts } from '../graphql/queries';

export default function Home() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);
  async function fetchPosts() {
    const postData = await API.graphql({
      query: listPosts,
    });
    const { items } = postData.data.listPosts;
    // Fetch images from S3 for posts that contain a cover image
    const postsWithImages = await Promise.all(
      items.map(async (post) => {
        if (post.coverImage) {
          post.coverImage = await Storage.get(post.coverImage);
        }
        return post;
      })
    );
    setPosts(postsWithImages);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">Posts</h1>
      <ul className="divide-y divide-gray-100">

        {posts.map((post, index) => (
                    <Link key={index} href={`/posts/${post.id}`}>
                  <article key={index} className="p-4 flex space-x-4 cursor-pointer">
                  {post.coverImage ? (
                    <img
                      src={post.coverImage}
                      alt=""
                      className="flex-none w-36 h-36 rounded-lg object-cover bg-gray-100"
                      width="144"
                      height="144"
                      />
                  ): <div className="flex items-center justify-center w-36 h-36 rounded-md text-white font-extrabold text-center bg-gray-300">No image</div>
                  }
                  <div className="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
                    <h2 className="text-xl font-semibold text-black mb-0.5">{post.title}</h2>
                    <dl className="flex flex-wrap text-sm font-medium whitespace-pre">
                      <div className="flex-none w-full mt-0.5 font-normal">
                        <dt className="text-gray-500 inline">By</dt> <dd className="inline text-black">{post.username}</dd>
                      </div>
                    </dl>
                  </div>
                </article>
                      </Link>
          // <Link key={index} href={`/posts/${post.id}`}>
          //   <div className="my-6 pb-6 border-b border-gray-300	flex">
          //     {post.coverImage && <img src={post.coverImage} className="w-14" />}

          //     <div className="cursor-pointer mt-2 ml-4">
          //       <h2 className="text-xl font-semibold">{post.title}</h2>
          //       <p className="text-gray-500 mt-2">Author: {post.username}</p>
          //     </div>
          //   </div>
          // </Link>
        ))}
      </ul>
    </div>
  );
}
