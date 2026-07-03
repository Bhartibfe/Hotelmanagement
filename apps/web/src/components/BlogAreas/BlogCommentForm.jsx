import React from "react";

export const BlogCommentForm = () => {
  return (
    <div className="comment-respond">
      <h3 className="comment-reply-title">Post a comment</h3>
      <form action="#" className="comment-form">
        <p className="comment-notes">
          Your email address will not be published. Required fields are marked *
        </p>
        <div className="form-grp">
          <textarea name="comment" placeholder="Comment"></textarea>
        </div>
        <div className="row">
          <div className="col-md-4">
            <div className="form-grp">
              <input type="text" placeholder="Name" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-grp">
              <input type="email" placeholder="Email" />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-grp">
              <input type="url" placeholder="Website" />
            </div>
          </div>
        </div>
        <div className="form-grp checkbox-grp">
          <input type="checkbox" id="checkbox" />
          <label for="checkbox">
            Save my name, email, and website in this browser for the next time I
            comment.
          </label>
        </div>
        <button type="submit" className="submit-btn">
          Submit Post
        </button>
      </form>
    </div>
  );
};
