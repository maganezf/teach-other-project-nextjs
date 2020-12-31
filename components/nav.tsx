import { NextPage } from 'next';
import Link from 'next/link';

const Nav: NextPage = () => (
  <nav>
    <ul className="flex items-center justify-between p-8">
      <li>
        <Link href="/">
          <a className="text-blue-500 no-underline text-accent-1 dark:text-blue-300">
            Teach Other 📚
          </a>
        </Link>
      </li>

      <ul className="flex items-center justify-between space-x-4">
        <li>
          <Link href="/profile">
            <a className="btn-blue no-underline ">Profile 👤</a>
          </Link>
        </li>

        <li>
          <Link href="/search">
            <a className="btn-blue no-underline ">Search Teacher 🔍</a>
          </Link>
        </li>
      </ul>
    </ul>
  </nav>
);

export default Nav;
