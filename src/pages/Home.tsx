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
      <div className="my-4">
        {/* <!-- Google Calendar Appointment Scheduling begin --> */}
        <iframe
          src="https://calendar.google.com/calendar/appointments/schedules/AcZssZ3HvLSAPD2RMncpfe3rtLSbTMfd9_g1IaOukmd04oaDFgSHclpy4gqMEAcrq4-MUjV4vmZ4BEjS?gv=true"
          style={{ border: 0 }}
          width="100%"
          height={600}
          frameBorder={0}
        />
        {/* <!-- end Google Calendar Appointment Scheduling --> */}
      </div>
    </div>
  );
};

export default Home;
