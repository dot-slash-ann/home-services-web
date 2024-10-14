import { FunctionComponent, h } from 'preact';
import { Link } from 'react-router-dom';

const Navbar: FunctionComponent = (): h.JSX.Element => {
  return (
    <nav class="bg-gray-800 p-4 shadow-md">
      <ul class="flex space-x-4">
        <li>
          <Link to={'/'} class="text-white hover:text-gray-300">
            Home
          </Link>
        </li>
        <li>
          <Link to={'/budgets'} class="text-white hover:text-gray-300">
            Budgets
          </Link>
        </li>
        <li>
          <Link to={'/categories'} class="text-white hover:text-gray-300">
            Categories
          </Link>
        </li>
        <li>
          <Link to={'/tags'} class="text-white hover:text-gray-300">
            Tags
          </Link>
        </li>
        <li>
          <Link to={'/transactions'} class="text-white hover:text-gray-300">
            Transactions
          </Link>
        </li>
        <li>
          <Link to={'/users'} class="text-white hover:text-gray-300">
            Users
          </Link>
        </li>
        <li>
          <Link to={'/vendors'} class="text-white hover:text-gray-300">
            Vendors
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
