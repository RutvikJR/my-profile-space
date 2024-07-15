import { useEffect } from "react";
import counterStore from "../store/couterStore";
import userStore from "../store/userStore";

const Home = () => {
  const { count, decrement, increment } = counterStore();
  const { loadFaqs,loadServices,loadSkills,loadExperience,loadEducation,loadProjects,loadTestimonials } = userStore();
  const onCountIncrement = () => {
    increment();
  };

  const onCountDecrement = () => {
    decrement();
  };

 

  useEffect(() => {
    loadSkills();
    loadExperience();
    loadEducation();
    loadFaqs();
    loadServices();
    loadTestimonials();
    loadProjects();
  }, []);

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
