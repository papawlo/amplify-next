import '../styles/globals.css';
import '../configureAmplify';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Auth, Hub } from 'aws-amplify';
import ActiveLink from '../components/ActiveLink';

function MyApp({ Component, pageProps }) {
  const [signedInUser, setSignedInUser] = useState(false);
  const isActive = true;
  useEffect(() => {
    authListener();
  });

  async function authListener() {
    Hub.listen('auth', (data) => {
      switch (data.payload.event) {
        case 'signIn':
          return setSignedInUser(true);
        case 'signOut':
          return setSignedInUser(false);
      }
    });
    try {
      await Auth.currentAuthenticatedUser();
      setSignedInUser(true);
    } catch (err) {}
  }

  return (
    <div className="divide-y divide-gray-100">
      <nav className="p-4">
        <ul className="flex space-x-2">
          <li>
            <ActiveLink
              href="/"
              current="bg-gray-100 text-gray-900"
              default="text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <a className="group flex items-center px-2 py-2 text-base font-medium rounded-md">
                <ActiveLink.Child
                  current="text-gray-500"
                  default="text-gray-400 group-hover:text-gray-500"
                >
                  <svg
                    className="mr-4 h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </ActiveLink.Child>
                Home
              </a>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/create-post"
              current="bg-gray-100 text-gray-900"
              default="text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <a className="group flex items-center px-2 py-2 text-base font-medium rounded-md">Create Post</a>
            </ActiveLink>
          </li>
          <li>
            <ActiveLink
              href="/profile"
              current="bg-gray-100 text-gray-900"
              default="text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            >
              <a className="group flex items-center px-2 py-2 text-base font-medium rounded-md">Profile</a>
            </ActiveLink>
          </li>
          {signedInUser && (
            <li>
              <ActiveLink
                href="/my-posts"
                current="bg-gray-100 text-gray-900"
                default="text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              >
                <a className="group flex items-center px-2 py-2 text-base font-medium rounded-md">My Posts</a>
              </ActiveLink>
            </li>
          )}
        </ul>
      </nav>
      <div className="py-8 px-16">
        <Component {...pageProps} />
      </div>
    </div>
  );
}

export default MyApp;
