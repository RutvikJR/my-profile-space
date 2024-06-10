import counterStore from "../store/couterStore";

const Home = () => {
  const { count, decrement, increment } = counterStore();
  const onCountIncrement = () => {
    increment();
  };

  const onCountDecrement = () => {
    decrement();
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
      <h3>test</h3>
    </div>
  );
};

export default Home;
