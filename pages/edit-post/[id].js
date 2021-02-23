import { useEffect, useState, useRef } from 'react';
import { withAuthenticator } from '@aws-amplify/ui-react';
import { API, Storage } from 'aws-amplify';
import { useRouter } from 'next/router';
import { v4 as uuid } from 'uuid';
import SimpleMDE from 'react-simplemde-editor';
import { updatePost } from '../../graphql/mutations';
import { getPost } from '../../graphql/queries';
import 'easymde/dist/easymde.min.css';

function EditPost() {
  const [post, setPost] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [coverImage, setCoverImage] = useState(null);
  const [localImage, setLocalImage] = useState(null);
  const fileInput = useRef(null);

  useEffect(() => {
    fetchPost();
    async function fetchPost() {
      if (!id) return;
      const postData = await API.graphql({
        query: getPost,
        variables: { id },
      });
      setPost(postData.data.getPost);
      if (postData.data.getPost.coverImage) {
        updateCoverImage(postData.data.getPost.coverImage);
      }
    }
  }, [id]);

  if (!post) return null;
  async function updateCoverImage(coverImage) {
    const imageKey = await Storage.get(coverImage);
    setCoverImage(imageKey);
  }
  async function uploadImage() {
    fileInput.current.click();
  }
  function handleChange(e) {
    const fileUploaded = e.target.files[0];
    if (!fileUploaded) return;
    setCoverImage(fileUploaded);
    setLocalImage(URL.createObjectURL(fileUploaded));
  }
  const { title, content } = post;

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }));
  }

  async function updateCurrentPost() {
    if (!title || !content) return;
    const postUpdated = {
      id,
      content,
      title,
    };

    // check to see if there is a cover image and that it has been updated
    if (coverImage && localImage) {
      const fileName = `${uuid()}_${coverImage.name}`;
      postUpdated.coverImage = fileName;
      await Storage.put(fileName, coverImage);
    }

    await API.graphql({
      query: updatePost,
      variables: { input: postUpdated },
      authMode: 'AMAZON_COGNITO_USER_POOLS',
    });
    console.log('post successfully updated!');
    router.push(`/my-posts`);
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Edit Post</h1>
      {coverImage && <img src={localImage ? localImage : coverImage} className="mt-4" />}
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      <SimpleMDE value={post.content} onChange={(value) => setPost({ ...post, content: value })} />
      <input type="file" ref={fileInput} className="absolute w-0 h-0" onChange={handleChange} />

      <button
        className="bg-indigo-500 hover:bg-indigo-600 text-white font-bold py-2 px-8 rounded-lg inline-flex items-center mr-2"
        onClick={uploadImage}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
        <span>Upload Cover Image</span>
      </button>

      <button
        type="button"
        className="mb-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-8 rounded-lg inline-flex items-center"
        onClick={updateCurrentPost}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          className="w-4 h-4 mr-2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
          />
        </svg>
        <span>Update Post</span>
      </button>
    </div>
  );
}

export default withAuthenticator(EditPost);
