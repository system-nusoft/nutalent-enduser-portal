import { memo } from "react";
import { Link } from "react-router-dom";

const NotFound = () => (
  <div className="text-center">
    <header className="bg-white min-h-screen flex flex-col justify-center items-center text-black">
      <p data-cy="welcome-text">Not Found</p>
      <div className="flex-row">
        <Link to="/">Back to home</Link>
      </div>
    </header>
  </div>
);

export default memo(NotFound);
