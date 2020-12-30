import { NextPage } from 'next';
import Link from 'next/link';

const Nav: NextPage = () => (
  <nav>
    <ul className="flex items-center justify-between p-8">
      <li>
        <Link href="/">
          <a href="/" className="text-blue-500 no-underline text-accent-1 dark:text-blue-300">
            Hello, we are up now 🚀
          </a>
        </Link>
      </li>
      <ul className="flex items-center justify-between space-x-4">
        <h1>auu</h1>
      </ul>
    </ul>
  </nav>
);

export default Nav;
