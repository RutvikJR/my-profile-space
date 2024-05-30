import React from 'react';
import { useFormik } from 'formik';
import { supabaseClient } from "../config/supabaseConfig";
import { LoginSchema } from '../utils/LoginScheme';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from "react-router-dom";

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {

  const navigate = useNavigate();
  const initialValues: LoginFormValues = {
    email: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: LoginSchema,
    onSubmit: async (values, { resetForm }) => {
      try {
        const { error } = await supabaseClient.auth.signInWithPassword({
          email: values.email,
          password: values.password,
        });

        if (error) {
          toast.error(error.message, { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme:'colored' });
          console.log('Error:', error);
        } else {
          toast.success('Login successful!', { position: "top-right", autoClose: 5000, hideProgressBar: false, closeOnClick: true, pauseOnHover: true, draggable: true, progress: undefined, theme:'colored' });
          console.log('Login successful');
          navigate("/");
        }
      } catch (error) {
        console.log('Error:', error);
      }

      resetForm();
    },
  });

  return (
    <div className="bg-white font-serif rounded-lg border border-gray-300 p-8 shadow-xl" style={{ width: '400px', margin: 'auto', marginTop: '50px' }}>
      <h1 className="mb-5 text-2xl font-bold text-gray-700 text-center">Login</h1>
      <form onSubmit={formik.handleSubmit} className="flex flex-col space-y-5">
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
        <button
          type="submit"
          className="bg-indigo-500 text-white p-3 rounded-lg hover:bg-indigo-600 transition-colors duration-300"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;