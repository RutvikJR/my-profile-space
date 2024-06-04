import counterStore from "../store/couterStore";

const Contact = () => {
  const { count } = counterStore();
  return (
    <div>
      <div>Contact Page</div>
      <div>{count}</div>
    </div>
  );
};

export default Contact;
