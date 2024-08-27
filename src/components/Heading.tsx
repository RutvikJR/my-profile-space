import { Link } from "react-router-dom";

function Heading({ title }: { title: string }) {
  return (
    <div className="relative my-8 flex items-center w-full justify-center">
      <Link
        className="absolute left-0 top-0 font-semibold text-cyan-500"
        to="/"
      >
        {" "}
        &#8592; Home
      </Link>
      <h1 className="text-3xl font-bold text-center text-cyan-500">{title}</h1>
    </div>
  );
}

export default Heading;
