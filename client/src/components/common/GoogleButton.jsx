const GoogleButton = ({ handleGoogleLogin, errorMessage }) => {
    return (
      <>
        {errorMessage !== "User not exist, you have to sign up first" ? (
          <button
            type="button"
            style={{
              marginTop: "2vh",
              borderRadius: "5px",
              border: "none",
              marginRight: "10px",
              width: "100%",
              whiteSpace: "pre-wrap",
            }}
            onClick={() => handleGoogleLogin()}
          >
            <i className="fa-brands fa-google"> </i>
            <>Continute with Google</>
          </button>
        ) : (
          <button
            type="button"
            style={{
              marginTop: "2vh",
              borderRadius: "5px",
              border: "none",
              marginRight: "10px",
              width: "100%",
              whiteSpace: "pre-wrap",
            }}
            onClick={() => handleGoogleLogin()}
          >
            <i className="fa-brands fa-google"> </i>
            <>Sign up with Google</>
          </button>
        )}
      </>
    );
  };
  
  export default GoogleButton;
  