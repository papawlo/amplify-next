import { useEffect, useState } from 'react'
import { withAuthenticator } from '@aws-amplify/ui-react'
import { API } from 'aws-amplify'
import { useRouter } from 'next/router'
import SimpleMDE from "react-simplemde-editor"
import { updatePost } from '../../graphql/mutations'
import { getPost } from '../../graphql/queries'
import "easymde/dist/easymde.min.css"

function EditPost() {
  const [post, setPost] = useState(null);
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
      fetchPost();
      async function fetchPost() {
          if (!id) return;
          const postData = await API.graphql({
              query: getPost,
              variables: { id },
            });
            setPost(postData.data.getPost);
        }
    }, [id]);

    if (!post) return null;
    const { title, content } = post;

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function updateCurrentPost() {
    if (!title || !content) return;

    await API.graphql({
      query: updatePost,
      variables: { input: { title, content, id } },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });
    console.log('post successfully updated!');
    router.push(`/my-posts`);
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE value={post.content} onChange={(value) => setPost({ ...post, content: value })} />
      <button
        type="button"
        className="mb-4 bg-blue-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={updateCurrentPost}
      >
        Update Post
      </button>
    </div>
  );
}

export default withAuthenticator(EditPost);
