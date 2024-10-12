import { h } from 'preact';
import { Link } from 'react-router-dom';

const NotFound = (): h.JSX.Element => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl mt-4">Page Not Found</p>
      <Link to="/" className="mt-6 text-blue-500 underline">
        Go back home
      </Link>
    </div>
  );
};

export default NotFound;
