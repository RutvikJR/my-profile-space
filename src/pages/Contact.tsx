import { RootState } from "../redux/store";
import { useSelector } from "react-redux";

const Contact = () => {
  const count = useSelector((state: RootState) => state.counter.count);
  return (
    <div>
      <div>Contact Page</div>
      <div>{count}</div>
    </div>
  );
};

export default Contact;
