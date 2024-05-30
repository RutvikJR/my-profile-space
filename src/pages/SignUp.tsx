import { useFormik } from 'formik';
import { SignUpSchema } from '../utils/SignUpSchema';
import { supabaseClient } from "../config/supabaseConfig";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
interface SignUpFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

const SignUp: React.FC = () => {

  const navigate = useNavigate();

  const initialValues: SignUpFormValues = {
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: SignUpSchema,
    onSubmit: async (values, { resetForm }) => {
      console.log("Form Values:", values);

      try {
        const { data, error } = await supabaseClient.auth.signUp({
          email: values.email,
          password: values.password,
          options: {
            data: {
              name: values.name
            }
          }
        });

        if (error) {
          toast.error(error.message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log(`Error : ${error}`);
        } else {
          toast.success('Verification link sent successfully!', {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
          });
          console.log(`Data : ${data}`);
          navigate("/login");
        }

        resetForm();
      } catch (error) {
        console.log(`Error : ${error}`);
      }
    },
  });


  return (
    <div
      className="bg-white font-serif rounded-lg border border-gray-300 p-8 shadow-xl"
      style={{ width: '400px', margin: 'auto', marginTop: '50px' }}
    >
      <h1 className="mb-5 text-2xl font-bold text-gray-700 text-center">
        Sign Up
      </h1>
      <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-5">
        <div className="flex flex-col">
          <label htmlFor="name" className="mb-2 font-medium text-gray-600">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter your name"
            className="p-3 border h-10 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formik.values.name}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500">{formik.errors.name}</div>
          ) : null}
        </div>
        <div className="flex flex-col">
          <label htmlFor="email" className="mb-2 font-medium text-gray-600">
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Enter your email"
            className="p-3 border h-10 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formik.values.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.email && formik.errors.email ? (
            <div className="text-red-500">{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="flex flex-col">
          <label htmlFor="password" className="mb-2 font-medium text-gray-600">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Enter your password"
            className="p-3 border h-10 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formik.values.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.password && formik.errors.password ? (
            <div className="text-red-500">{formik.errors.password}</div>
          ) : null}
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="confirmPassword"
            className="mb-2 font-medium text-gray-600"
          >
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            placeholder="Confirm your password"
            className="p-3 border h-10 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
            value={formik.values.confirmPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
            <div className="text-red-500">{formik.errors.confirmPassword}</div>
          ) : null}
        </div>
        <button
          type="submit"
          className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
};

export default SignUp;