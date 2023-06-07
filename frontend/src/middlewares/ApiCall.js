async function ApiCall(api,data){
    console.log(data)
    if(data == undefined){
        try {
            const response = await fetch(api, {
              method: "POST", // or 'PUT'
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
              },
             
            });
        
            const result = await response.json();
            console.log("Success:", result);
            return result;
          } catch (error) {
            console.error("Error:", error);
          }
    }
    else {

        try {
            const response = await fetch(api, {
              method: "POST", // or 'PUT'
              headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${localStorage.getItem('jwtToken')}`
              },

              body: JSON.stringify(data),
            });
        
            const result = await response.json();
            console.log("Success:", result);
            return result;
          } catch (error) {
            console.error("Error:", error);
          }
    }
}
export {ApiCall};