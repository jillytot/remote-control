import { useEffect, useState } from "react";
import axios from "axios";

const Requests = async ({ url, type, payload, handleResult }) => {
  const [token] = useState(() => {
    return localStorage.getItem("token");
  });

  const [retry, setRetry] = useState(0);

  useEffect(() => {
    handleReq();
  });

  const handleReq = async () => {
    if (!type || type === "post") handlePost();
    return null;
  };

  handleTimeout = callback => {
    handleResult({ error: "error, unable to complete request, retrying." });
    if (retry < 3) {
      setTimeout(() => {
        callback;
      }, 600); //retry
      setRetry(retry + 1);
    } else {
      handleResult({
        error: "unable to contact server, please try again later."
      });
    }
  };

  handlePost = async () => {
    if (!token) handleResult({ error: "authentication error." });
    await axios
      .post(
        url,
        {
          payload
        },
        {
          headers: { authorization: `Bearer ${token}` }
        }
      )
      .then(res => {
        handleResult(res.data);
      })
      .catch(err => {
        console.log("API Request Error: ", err);
        handleTimeout(handlePost);
      });

    return;
  };

  return null;
};

export default Requests;
