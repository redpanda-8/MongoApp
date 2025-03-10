"use-strict"
console.log("index.js initiated")
import { simpleRole } from "./simpleRole.js"
import { adminRole } from "./adminRole.js"
import { displayPosts } from "./displayPosts.js"

const regSelect=document.getElementById("registerSelect")
const loginSelect=document.getElementById("loginSelect")

const registerForm=document.getElementById("registration-form")
const loginForm=document.getElementById("login-form")

const regSubmit=document.getElementById("regSubmit")
const loginSubmit=document.getElementById("logSubmit")

const header=document.getElementById("header")

const container=document.getElementById("mainContainer")

const regLogContainer=document.getElementById("regLogContainer")

const showRegistrationForm = () => {
    registerForm.classList.remove('displayNone');
    loginForm.classList.add('displayNone');
    regSelect.classList.add('displayNone');
    loginSelect.classList.remove('displayNone');
};

const showLoginForm = () => {
    registerForm.classList.add('displayNone');
    loginForm.classList.remove('displayNone');
    regSelect.classList.remove('displayNone');
    loginSelect.classList.add('displayNone');
};

const toggleFormState = (() => {
    let currentForm = 'login';
    return () => {
        currentForm = currentForm === 'login' ? 'register' : 'login';
        currentForm === 'register' ? showRegistrationForm() : showLoginForm();
    };
})();

const initializeFormHandlers = () => {
    const buttonContainer = document.getElementById("header");
    const buttonHandlers = {
        'registerSelect': () => toggleFormState(),
        'loginSelect': () => toggleFormState()
    };
    
    buttonContainer.addEventListener("click", (e) => { // add listeners on buttons inside specified container
        const button = e.target.closest('[id]');  // Find closest element with an ID
        if (button && buttonHandlers[button.id]) {
            e.preventDefault();
            buttonHandlers[button.id]();
        }
    });

    showLoginForm();
};


// fnc to verify user and execute functions based on role
const verification=()=>{
    fetch("http://127.0.0.1:999/auth/verify",{
        method: "GET",
        credentials: "include"
    })
    .then((res)=>{
        if(res.ok) return res.json();
        else throw new Error("User not authenticated")
    })
    .then(user=>{
        if(user._id && user.isBlocked===false){
            console.log("User is logged in: ",user)
            regLogContainer.remove()
            registerSelect.remove()
            loginSelect.remove()
            const logoutBtn=document.createElement("button")
            const filterPosts=document.createElement("select")
            filterPosts.addEventListener("change",()=>{
                console.log("selected", filterPosts.value)
                displayPosts(filterPosts.value)
            })
            const defaultOption=document.createElement("option")
            defaultOption.innerText="Category name"
            defaultOption.value=""
            filterPosts.append(defaultOption)
            fetch("http://127.0.0.1:999/category",{method:"get"})
            .then((res)=>res.json())
            .then((data)=>data.forEach(element => {
                const option=document.createElement("option")
                option.value=element.name
                option.innerText=element.name
                filterPosts.append(option)
            }))
            logoutBtn.innerText="Log out"
            logoutBtn.addEventListener("click",()=>{
                fetch("http://127.0.0.1:999/auth/logout", { method: "POST",credentials:"include" })  // Trigger the logout route
                    .then((res) => {
                    console.log("logged out!")
                    window.location.reload();  // Reload after logout
                    })
                    .catch((err) => console.error("Logout failed:", err));
            })
            header.append(logoutBtn,filterPosts)
            user.role === "simple" ? simpleRole() : adminRole()
        } else if(user.isBlocked===true){ // if blocked, alert and delete cookies
            alert("Your account is blocked")
            fetch("http://127.0.0.1:999/auth/logout", { method: "POST",credentials:"include" })
            .then((res) => window.location.reload())
        }
    })
    .catch((error)=>console.log(error.message))
}
// execute on page load
document.addEventListener('DOMContentLoaded', (e)=>{
    initializeFormHandlers();
    verification();
});

// submit registration
registerForm.addEventListener("submit", async(e)=>{
    e.preventDefault()
    console.log("register submit");
    const name=document.getElementById("regName").value
    const email=document.getElementById("regEmail").value
    const password=document.getElementById("regPass").value
    if(name && email && password){
        try{
            const response = await fetch("http://127.0.0.1:999/users/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({name, email, password }),
            });
            const result = await response.json();
            console.log(result);
        }catch(error){
            console.error("Registration error: ",error)
        }
        //log in after registration
        try{
        const response = await fetch("http://127.0.0.1:999/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password }),
        credentials: "include",
        });
        const result = await response.json();
        console.log(result);
        response.ok ? verification() : alert('Login failed')
        } catch(error){
            console.error("Login error: ",error)
        }
    }else{
        alert("Fields cant be blank")
    }
    
})
// submit login
loginForm.addEventListener("submit",async(e)=>{
    e.preventDefault()
    console.log("login submit");
    console.log(document.getElementById("logEmail").value)
    console.log(document.getElementById("logPass").value,"\n")
    const email=document.getElementById("logEmail").value
    const password=document.getElementById("logPass").value
    if(email && password){
        try{
        const response = await fetch("http://127.0.0.1:999/users/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({email, password }),
        credentials: "include",
        });
        const result = await response.json();
        console.log(result);
        response.ok ? verification() : alert('Login failed')
        } catch(error){
            console.error("Login error: ",error)
        }
    }else{
        email ? alert("password cant be empty") : alert("email cant be empty")
    }
    
    
})