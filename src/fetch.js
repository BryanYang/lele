import axios from "axios";
import Cookies from "js-cookie";

axios.defaults.headers.post["Content-Type"] =
  "application/x-www-form-urlencoded";
// Add a request interceptor
axios.interceptors.request.use(
  function(config) {
    // Do something before request is sent
    if (config.method === "post") {
      const contentType = config.headers["Content-Type"];
      if (contentType !== "multipart/form-data") {
        config.data =
          config.data + "&token=" + encodeURIComponent(Cookies.get("token"));
      }
    } else {
      config.params = Object.assign({}, config.params, {
        token: Cookies.get("token")
      });
    }

    return config;
  },
  function(error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default axios;
