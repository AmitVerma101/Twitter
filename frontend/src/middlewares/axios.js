import axios from "axios";
const config = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
    'Content-Type':'application/json'
  },
};
async function axiosApiCall(link, formData) {
  return axios
    .post(link, formData, config)
    .then((response) => {
      // console.log("consoling the response");
      // console.log(response);

      return response;
    })

    .catch((error) => {
      console.log("I am coming in catch of inner");
      console.log(error);
    });
  }
export { axiosApiCall };
