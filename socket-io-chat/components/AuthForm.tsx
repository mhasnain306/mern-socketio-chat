import { useEffect, useState } from "react";
import React from "react";
import useUsers, { UserData } from "../hooks/useUsers";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

const AuthForm = () => {
  const [isSignUpMode, setSignUpMode] = useState(false);
  const { createUser, signIn, data, isLoading, error } =
    useUsers();
  const { register, handleSubmit } = useForm<UserData>();
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("chatAppToken")) {
      navigate("/chat");
    }
    if (data && localStorage.getItem("chatAppToken")) {
      navigate("/chat");
    }
  });
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isSignUpMode
              ? "Create your account"
              : "Sign in to your account"}
          </h2>
        </div>
        <form
          onSubmit={handleSubmit((data) => {
            if (isSignUpMode) {
              createUser(data);
            } else {
              signIn(data);
            }
          })}
          className="mt-8 space-y-6"
        >
          <div className="rounded-md shadow-sm space-y-4">
            {isSignUpMode && (
              <div>
                <label htmlFor="name" className="sr-only">
                  Name
                </label>
                <input
                  {...register("name")}
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                  placeholder="Full Name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                {...register("email")}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                {...register("password")}
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isSignUpMode
                ? isLoading
                  ? "registering..."
                  : "Sign up"
                : "Sign in"}
            </button>
          </div>
        </form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600 inline-block mr-2">
            {isSignUpMode
              ? "Already have an account?"
              : "Don't have an account?"}
          </p>
          <button
            onClick={() => setSignUpMode(!isSignUpMode)}
            className="text-indigo-600 hover:text-indigo-500 font-medium text-sm"
          >
            {isSignUpMode ? "Sign in" : "Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
