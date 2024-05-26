import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../redux/store";
import { setCount } from "../redux/slice/counter";

const Home = () => {
  const dispatch = useDispatch<AppDispatch>();

  const count = useSelector((state: RootState) => state.counter.count);

  const onCountIncrement = () => {
    dispatch(setCount(count + 1));
  };

  const onCountDecrement = () => {
    dispatch(setCount(count - 1));
  };
  return (
    <div>
      <div className="m-2 text-xl font-semibold">Page: home</div>
      <div className="m-2 text-xl font-semibold">counter</div>
      <div className="m-2 text-xl font-semibold">{count}</div>
      <button
        className="p-4 bg-cyan-600 text-white m-2 rounded-lg"
        onClick={onCountIncrement}
      >
        increment
      </button>
      <button
        className="p-4 bg-cyan-600 text-white m-2 rounded-lg"
        onClick={onCountDecrement}
      >
        decrement
      </button>
    </div>
  );
};

export default Home;
