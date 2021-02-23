import { useState, useEffect } from 'react';
import Link from 'next/link';
import { API, Auth } from 'aws-amplify';
import { postsByUsername } from '../graphql/queries';
import { deletePost, deletePost as deletePostMutation } from '../graphql/mutations';

export default function MyPosts() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    fetchPosts();
  }, []);
  async function fetchPosts() {
    const { username } = await Auth.currentAuthenticatedUser();
    const postData = await API.graphql({
      query: postsByUsername,
      variables: { username },
    });
    setPosts(postData.data.postsByUsername.items);
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6 mb-2">My Posts</h1>
      <ul className="divide-y divide-gray-100">
        {posts.map((post, index) => (
          <article key={index} className="p-4 flex space-x-4">
            <div className="min-w-0 relative flex-auto sm:pr-20 lg:pr-0 xl:pr-20">
              <h2 className="text-xl font-semibold text-black mb-0.5">{post.title}</h2>
              <dl className="flex flex-wrap text-sm font-medium whitespace-pre">
              <div className="flex-none w-full my-1 font-normal">
                  <dt className="text-gray-500 inline">By</dt>{' '}
                  <dd className="inline text-black">{post.username}</dd>
                </div>
                <div>
                  <dt className="sr-only">Edit</dt>
                  <dd>
                    <Link href={`/edit-post/${post.id}`}>
                      <a title="Edit" className="text-sm bg-blue-500 hover:bg-blue-600 text-white py-2 px-2 mr-1 rounded inline-flex items-center">
                        <svg
                          className="w-5 inline"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </a>
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">View</dt>
                  <dd>
                    <Link href={`/post/${post.id}`}>
                      <a title="View" className="text-sm bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-2 mr-1 rounded inline-flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path
                            fillRule="evenodd"
                            d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </a>
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Delete</dt>
                  <dd>
                    <button
                      className="text-sm bg-red-500 hover:bg-red-600 text-white py-2 px-2 mr-1 rounded inline-flex items-center"
                      onClick={() => deletePost(post.id)}
                      title="Remove"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </dd>
                </div>

              </dl>
            </div>
          </article>
        ))}
      </ul>
    </div>
  );
}
