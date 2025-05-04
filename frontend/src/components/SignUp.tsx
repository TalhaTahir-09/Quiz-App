import { Formik, Field, ErrorMessage, Form } from "formik";
import * as Yup from "yup";
import axios from "axios";
function SignIn() {
  interface User {
    username: string;
    password: string;
    cpassword: string;
  }
  const SignupSchema = Yup.object().shape({
    username: Yup.string()
      .min(3, "Too Short!")
      .max(16, "Too Long!")
      .required("Required"),
    password: Yup.string()
      .min(6, "Too Short!")
      .max(15, "Too Long!")
      .required("Required"),
    cpassword: Yup.string()
      .required("Required!")
      .oneOf([Yup.ref("password")], "Passwords must match"),
  });
  const onSubmitHandler = async (values: User, setFieldError: any) => {
    let user = { username: values.username, password: values.password };
    try {
      const response = await axios.post(
        "http://localhost:3000/users/signup",
        user
      );
      localStorage.setItem("accessToken", "")
      localStorage.setItem("accessToken", response.data.accessToken);
      console.log(response);
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status == 409) {
        setFieldError("username", "Username already exists");
      }
    }
  };

  return (
    <div className="sign-up-page-wrapper">
      <div className="sign-up-container">
        <div className="sign-up-box">
          <div className="sign-up-form-heading flex items-center flex-col justify-center">
            <h1 className="sign-up-heading text-gray-900 text-4xl">
              Welcome to Queezy
            </h1>
            <h1 className="text-gray-900 text-2xl font-semibold">Sign Up</h1>
          </div>
          <div className="sign-up-inputs">
            <Formik
              initialValues={{
                username: "",
                password: "",
                cpassword: "",
              }}
              validationSchema={SignupSchema}
              onSubmit={(values, { setFieldError }) => {
                onSubmitHandler(values, setFieldError);
              }}
            >
              {({ isValid, dirty }) => (
                <Form>
                  <div className="inner-form-div w-full gap-4">
                    <div className="w-full">
                      <label
                        htmlFor="username"
                        className=" text-lg font-medium mb-2 "
                      >
                        Username:
                        <span className="error-div">
                          <ErrorMessage name="username" />
                        </span>
                      </label>
                      <Field
                        id="username"
                        type="text"
                        name="username"
                        className="input-area p-4 w-full border border-gray-300 h-11 rounded-2xl"
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="password"
                        className="w-full text-lg font-medium mb-2"
                      >
                        Password:{" "}
                        <span className="error-div">
                          <ErrorMessage name="password" />
                        </span>
                      </label>
                      <Field
                        type="password"
                        name="password"
                        id="password"
                        className="input-area p-4 w-full border border-gray-300 h-11 rounded-2xl"
                      />
                    </div>
                    <div className="w-full">
                      <label
                        htmlFor="cpassword"
                        className="w-full text-lg font-medium mb-2"
                      >
                        Confirm Password:
                        <span className="error-div">
                          <ErrorMessage name="cpassword" />
                        </span>
                      </label>
                      <Field
                        type="password"
                        name="cpassword"
                        id="cpassword"
                        className="input-area p-4 w-full border border-gray-300 h-11 rounded-2xl"
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className={`submit-btn ${
                      isValid && dirty
                        ? "bg-blue-500 transition duration-250 ease-in-out hover:-translate-y-0.5 hover:scale-105 hover:bg-indigo-500"
                        : "bg-blue-500 opacity-50 cursor-not-allowed"
                    }`}
                    disabled={!(isValid && dirty)}
                  >
                    Sign Up
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SignIn;
