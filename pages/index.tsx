import { NextPage } from 'next';
import Nav from '../components/nav';

const HomePage: NextPage = () => (
  <div>
    <Nav />
    <div className="py-20 flex items-center justify-between p-8">
      <div className="text-blue-500 text-5xl text-center dark:text-blue-300">
        This is the Home Page
        <h1> Hello Next.js 👋 | Next.js + TypeScript + TailwindCSS Example</h1>
      </div>
    </div>
  </div>
);

export default HomePage;
