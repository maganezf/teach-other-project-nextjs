import { NextPage } from 'next';
import { signIn, signOut, useSession } from 'next-auth/client';
import Nav from '../components/nav';

const AppPage: NextPage = () => {
  const [session, loading] = useSession();

  return (
    <div className="text-blue-500 no-underline text-accent-1 dark:text-blue-300 text-3xl">
      <Nav />
      <h1 className="text-center text-5xl">App Page</h1>
      {!session && (
        <>
          Not signed in <br />
          <button type="button" onClick={() => signIn('auth0')}>
            Sign in
          </button>
        </>
      )}
      {session && (
        <>
          Signed in as {session.user.email} <br />
          <button type="button" onClick={() => signOut()}>
            Sign out
          </button>
        </>
      )}

      {loading && (
        <div className="text-5xl text-center">
          <h1>Loading...</h1>
        </div>
      )}
    </div>
  );
};

export default AppPage;
