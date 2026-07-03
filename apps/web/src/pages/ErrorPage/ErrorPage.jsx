import React from "react";
import { Layout } from "../../layouts/Layout";
import { Link } from "react-router-dom";

const ErrorPage = () => {
  return (
    <Layout>
      {/* error-area */}
      <section className="error-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="error-content">
                <h1 className="error-404">
                  4<span>0</span>4
                </h1>

                <h2 className="title">OOPS! Nothing Was Found</h2>

                <p>
                  Oops! it could be you or us, there is no page here. It might
                  have <br />
                  been moved or deleted.Back To Home
                </p>

                <Link to="/" className="btn btn-three">
                  Go Back To Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ErrorPage;
