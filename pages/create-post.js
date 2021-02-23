import { withAuthenticator } from '@aws-amplify/ui-react'
import { useState, useRef } from 'react'
import { API, Storage } from 'aws-amplify'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import SimpleMDE from "react-simplemde-editor"
import { createPost } from '../graphql/mutations'
import "easymde/dist/easymde.min.css"

const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()
  const [image, setImage] = useState(null)
  const hiddenFileInput = useRef(null)

  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    if (!title || !content) return
    const id = uuid()
    post.id = id

    if(image){
      const fileName = `${uuid()}_${image.name}`
      post.coverImage = fileName
      await Storage.put(fileName, image)
    }

    await API.graphql({
      query: createPost,
      variables: { input: post },
      authMode: "AMAZON_COGNITO_USER_POOLS"
    })
    router.push(`/posts/${id}`)
  }

  async function uploadImage() {
    hiddenFileInput.current.click();
  }

  function handleChange(e) {
    const fileUploaded= e.target.files[0]
    if(!fileUploaded) return
    setImage(fileUploaded)
  }

  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Create New Post</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      />
      {
        image && (
          <img src={URL.createObjectURL(image)}
          className="my4"/>
        )
      }
      <SimpleMDE value={post.content} onChange={value => setPost({ ...post, content: value })} />

      <input type="file"
      ref={hiddenFileInput}
      className="absolute w-0 h-0"
      onChange={handleChange}
      />
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
        onClick={createNewPost}
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
        <span>Save</span>
      </button>

    </div>
  )
}

export default withAuthenticator(CreatePost)