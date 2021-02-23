import { useState, useEffect } from 'react'
import { API , Storage} from 'aws-amplify'
import { useRouter } from 'next/router'
import Link from 'next/link';
import ReactMarkdown from 'react-markdown'
import '../../configureAmplify'
import { listPosts, getPost } from '../../graphql/queries'

export default function Post({ post }) {
  const [coverImage, setCoverImage] = useState(null)
  useEffect(() => {
    updateCoverImage()
  }, [])

  async function updateCoverImage() {
    if (post.coverImage) {
      const imageKey = await Storage.get(post.coverImage)
      setCoverImage(imageKey)
    }
  }
  console.log('post: ', post)

  const router = useRouter()
  if (router.isFallback) {
    return <div>Loading...</div>
  }
  return (
    <div>
      <h1 className="text-5xl mt-4 font-semibold tracking-wide">{post.title} <Link href={`/edit-post/${post.id}`}>
                <a className="text-3xl text-gray-500 inline" title='edit'>
                  <svg
                    className="w-10 inline text-gray-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>

                </a>
              </Link></h1>
      {
        coverImage && <img src={coverImage} className="mt-4" />
      }
      <p className="text-sm font-light my-4">by {post.username}</p>
      <div className="mt-8">
        <ReactMarkdown className='prose' children={post.content} />
      </div>
    </div>
  )
}

export async function getStaticPaths() {
  const postData = await API.graphql({
    query: listPosts
  })
  const paths = postData.data.listPosts.items.map(post => ({ params: { id: post.id } }))
  return {
    paths,
    fallback: true
  }
}

export async function getStaticProps({ params }) {
  const { id } = params
  const postData = await API.graphql({
    query: getPost, variables: { id }
  })
  return {
    props: {
      post: postData.data.getPost
    },
    // Next.js will attempt to re-generate the page:
    // - When a request comes in
    // - At most once every second
    revalidate: 100 // adds Incremental Static Generation, sets time in seconds
  }
}