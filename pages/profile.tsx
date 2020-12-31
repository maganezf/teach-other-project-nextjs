import { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client';
import useSWR from 'swr';

import api from '../utils/api';
import Nav from '../components/nav';

const ProfilePage: NextPage = () => {
  const [session, loading] = useSession();

  const { data, error } = useSWR(`/api/user/${session?.user.email}`, api);

  return (
    <div className="text-blue-500 no-underline text-accent-1 dark:text-blue-300 text-3xl">
      <Nav />
      {!session && (
        <div className="text-3xl">
          Please, Log in fist to get start <br />
          <button type="button" onClick={() => signIn('auth0')}>
            Sign in
          </button>
        </div>
      )}

      {session && data && (
        <>
          <h1 className="text-center text-5xl">Welcome to Profile Page</h1>
          <div className="text-3xl">
            Signed in as {session.user.email} <br />
            <button type="button" onClick={() => signOut()}>
              Sign out
            </button>
          </div>
          <h1 className="text-3xl">Name: {data.data.name}</h1>
          <h1 className="text-3xl">Coins: {data.data.coins}</h1>
        </>
      )}

      {error && (
        <h1>The user with this email: {session.user.email} does not exists </h1>
      )}

      {loading && (
        <div className="text-5xl text-center">
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
