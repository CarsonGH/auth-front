import React, { useState, createContext } from 'react';

export function useCreateAuth(src) {
  const AuthContext = createContext({ auth: null, authActions: {}, setAuth:null });
  const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(
      JSON.parse(localStorage.getItem("user_data"))
    );

    
    const sendMessageToIframe = (message) => {
      const iframe = document.getElementById('auth-embed');
      iframe.contentWindow.postMessage(message, "*");
      console.log("message sent to iframe",message)
    };

    function sendActionToIframe(action, data) {
      return new Promise((resolve, reject) => {
          const timeoutId = setTimeout(() => {
              window.removeEventListener('message', handleMessage);
              reject({httpCode:"0",errorMessage:"request timeout, 2 seconds passed with no response, authentication server may be down"});
          }, 2500);
  
          const actionid = action + String(Math.floor(Math.random() * 100000));
  
          const handleMessage = (event) => {
              // if (event.origin !== src) return;
              if (event.data.id !== actionid) return;
  
              window.removeEventListener('message', handleMessage);
              clearTimeout(timeoutId);
  
              if (event.data.err != null) {
                  console.log("error logging in:", event.data.err);
                  reject(event.data.err);
              } else {
                  console.log("event.data.data:", event.data.data);
                  console.log("whole event:", event);
                  setAuth(event.data.data); 
                  localStorage.setItem("user_data", JSON.stringify(event.data.data));
                  resolve(event.data.data);
              }
          };
  
          window.addEventListener('message', handleMessage);
          sendMessageToIframe({ id: actionid, action: action, data: data });
          console.log("message sent:",actionid,action,data)
      });
  }

  const authActions = {

      login: (credentials) => {
          return(sendActionToIframe('login', credentials))
      },
      registerUser: (userData) => {
        console.log("registerserAuthAction")
          sendActionToIframe('register', userData);
      },
      logout: () => {
          const rtn =sendMessageToIframe({ action: 'logout' });
          localStorage.removeItem("user_data");
          setAuth(null);
          return rtn;
      },
      refreshToken: () => {
          return(sendActionToIframe('refresh', {}));
      },
      forgotPassword: (email) => {
        return new Promise((resolve, reject) => {
          const jsonData = {
            "email": email,
          };
      
          fetch(src + "/forgot-password", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
          })
          .then(response => {
            if (!response.ok) {
              response.text().then(res=>{
                reject(res)
              }).catch(()=>{
                reject("could not send email")
              })
            } else {
              resolve(null);
            }
          })
          .catch(error => {
            reject('Error during forgot password: ' + String(error));
          });
        });
      },
      sendLoginByEmail: (email) => {
        return new Promise((resolve, reject) => {
          const jsonData = {
            "email": email,
          };
      
          fetch(src + "/send-login-email", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
          })
          .then(response => {
            if (!response.ok) {
              response.text().then((res)=>{
                reject(res)
              }).catch(()=>{
                reject("could not send email")
              })
            } else {
              resolve(null);
            }
          })
          .catch(error => {
            console.log('Error during forgot password: ' + String(error))
            reject('Email failed to send');
          });
        });
      },
      changePassword: (data) => {
        return new Promise((resolve, reject) => {
          if (data.newPassword.length < 8) {
            console.log("Password too short");
            reject("Password too short");
            return;
          }
      
          const send = {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              "username": data.newPassword,
              "password": data.oldPassword,
              "auth_token": auth.auth_token
            }),
          };
          fetch(src + "/change-password", send)
            .then(resp => {
              if (!resp.ok) {
                // Here you might want to handle specific response codes or messages
                // For simplicity, we'll just reject all non-ok responses
                resp.text().then(text => {
                  reject(text);
                });
              } else {
                resolve(null);
              }
            })
            .catch(err => {
              reject(String(err));
            });
        });
      },

      deleteAccount: (data) => {
        return new Promise((resolve, reject) => {
          const del = window.confirm("Are you sure you want to delete account? \nTHIS ACTION IS PERMANENT!!");
          if (!del) {
            console.log("Account stopped from being deleted");
            resolve("Deletion cancelled by user");
            return;
          }
          fetch(src + "/delete-account", {
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            credentials: "same-origin",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          })
          .then(res => {
            if (!res.ok) {
              return res.text().then(text => {
                console.log(text);
                reject(text);
              });
            } else {
              authActions.logout();
              resolve(null);
            }
          })
          .catch(error => {
            console.error("Error during account deletion:", error);
            reject(error);
          });
        });
      },
       verifyEmail : () => {
        return new Promise(async (resolve, reject) => {
          const jsonData = {
            "auth_token": auth.auth_token,
          };
      
          try {
            const response = await fetch(src + "/send-verification-email", {
              method: "POST",
              mode: "cors",
              cache: "no-cache",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(jsonData),
            });
            if (!response.ok) {
              reject('Verification Email Failed To Send');
              return
            } else {
              resolve(null);
              return
            }
          } catch (err) {
            reject(String(err));
            return
          }
        });
      },
      verifyUser : (data)=>{
        return new Promise((resolve,reject)=>{
          const jsonData={
            "username":data.resetToken
          }
          fetch(src+"/verify",{
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
          }).then((res)=>{
            if (!res.ok){
              return res.text().then(text => {
                console.log(text);
                reject(text);
              }).catch(()=>reject("error verifying user"))
            }else{
                resolve(null)
            }
          }).catch(err=>{
            reject(String(err))
          })
        })
      },
      loginByEmail : (data)=>{
        return new Promise((resolve,reject)=>{
          const jsonData={
            "username":data.resetToken
          }
          fetch(src+"/verify",{
            method: "POST",
            mode: "cors",
            cache: "no-cache",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(jsonData),
          }).then((res)=>{
            if (!res.ok){
              return res.text().then(text => {
                console.log(text);
                reject(text);
              }).catch(()=>reject("error verifying user"))
            }else{
                resolve(null)
            }
          }).catch(err=>{
            reject(String(err))
          })
        }
      )
    },
    verifyResetLink : (resetToken)=>{
      return new Promise((resolve,reject)=>{
        const jsonData={
          "username":resetToken
        }
        fetch(src+"/verify-reset-link",{
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }).then((res)=>{
          if (!res.ok){
            return res.text().then(text => {
              console.log(text);
              reject(text);
            }).catch(()=>reject("error verifying user"))
          }else{
              resolve(null)
          }
        }).catch(err=>{
          reject(String(err))
        })
      })
    },
    resetPassword : (data)=>{
      return new Promise((resolve,reject)=>{
        const jsonData={
          "username":data.resetToken,
          "password":data.password,
        }
        fetch(src+"/set-new-password",{
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonData),
        }).then((res)=>{
          if (!res.ok){
            return res.text().then(text => {
              console.log(text);
              reject(text);
            }).catch(()=>reject("error resetting password"))
          }else{
              resolve(null)
          }
        }).catch(err=>{
          reject(String(err))
        })
      })
    } 
  }
    return (
      <AuthContext.Provider value={{ auth, authActions, setAuth }}>
        <iframe id="auth-embed" src={src+"/embed"} style={{ display: 'none' }} />
        {children}
      </AuthContext.Provider>
    );
  };

  return [AuthProvider, AuthContext];
}

