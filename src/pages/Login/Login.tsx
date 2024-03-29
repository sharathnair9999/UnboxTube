import React, { useState } from "react";
import { Link } from "react-router-dom";
import { constants } from "../../app-utils";
import { Password } from "../../components";
import { useAuth } from "../../contexts";
import { useDocumentTitle } from "../../custom-hooks";
import "./Login.css";

const Login = () => {
  const { loginUser, testUser } = useAuth();
  type CredentialsType = {
    email: string;
    password: string;
  };
  const initialCredentialState = {
    email: "",
    password: "",
  };
  const [credentials, setCredentials] = useState<CredentialsType>(
    initialCredentialState
  );
  const submitUser = async (
    details: CredentialsType,
    e?: React.FormEvent<HTMLFormElement>
  ) => {
    e?.preventDefault();
    await loginUser(details);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials((details) => {
      return { ...details, [e.target.name]: e.target.value };
    });
  };

  const { titles } = constants;
  useDocumentTitle(titles.login());
  return (
    <div className="signup-container flex items-fs ">
      <div className="image-container">
        <img src="/login.png" alt="login" />
      </div>

      <form
        onSubmit={(e) => submitUser(credentials, e)}
        className="form-controls mt-1"
      >
        <div className="required-text">
          <label htmlFor="email" className="required-title" id="email">
            E-mail
          </label>
          <input
            type="email"
            onChange={handleChange}
            className="input-box"
            id="email"
            value={credentials.email}
            name="email"
            placeholder="john.doe@gmail.com"
            required
            autoFocus
          />
        </div>
        <div className="required-text">
          <label htmlFor="password" className="required-title">
            Create a Password
          </label>
          <Password
            placeholder="Type your password here..."
            fieldValue={credentials.password}
            fieldName={"password"}
            onChange={handleChange}
          />
        </div>
        <div className="flex justfy-fs items-center gap-sm">
          <button className="btn btn-secondary submit-btn" type="submit">
            Login
          </button>
          <button
            className="test-btn btn-primary btn flex-and-center gap-sm mb-1"
            onClick={() => {
              setCredentials(testUser);
              submitUser(testUser);
            }}
          >
            <span>Login as Test User</span>
            <i className="fa-solid fa-arrow-right-to-bracket"></i>
          </button>
        </div>
        <div className="password-mgmt">
          <p className="text-section">
            <span>New User?</span>
            <Link to={"/signup"} className="link">
              Signup
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
