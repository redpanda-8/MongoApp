import { displayPosts } from "./displayPosts.js"
export async function simpleRole(){
    const header=document.getElementById("header")
    const container=document.getElementById("mainContainer")

    const addPostBtn=document.createElement("button")
    addPostBtn.innerText="Add Post"

    const favoritesbtn=document.createElement("button")
    favoritesbtn.innerText="Favorites"


    container.innerText="SIMPLE USER"

    favoritesbtn.addEventListener("click",()=>{
        console.log("FavBtn")
        displayPosts(1)
    })
    
    const showPostsBtn=document.createElement("button")
    showPostsBtn.innerText="Show posts"
    showPostsBtn.id="showPostsBtn"
    showPostsBtn.addEventListener("click",()=>{
        displayPosts()
    })
    header.append(addPostBtn,showPostsBtn,favoritesbtn)

    addPostBtn.addEventListener("click",(e)=>{
        container.innerHTML=""
        const fieldNames=["Name","Category","Description","Price, eur","Image link"]

        const existingForm = document.getElementById("addPostForm");
        if (existingForm) {
        existingForm.remove()
        }
        const form=document.createElement("form")
        form.id="addPostForm"
        container.append(form)

        for (let x of fieldNames){
            const label=document.createElement("label")
            label.innerText=`${x}`
            // fetch categories from DB and add each one as an option in select
            if (x==="Category"){
                const select=document.createElement("select")
                const option=document.createElement("option")
                option.innerText="Choose category"
                option.value=""
                select.append(option)
                ///////
                try {
                    fetch("http://127.0.0.1:999/category")
                    .then(response=>response.json())
                    .then(categories=>{
                        categories.forEach(category => {
                            const option=document.createElement("option")
                            option.innerText=category.name
                            option.value=category.name
                            select.append(option)
                        });
                    })
                }catch(error){
                    console.error(error)
                }
                // add an ID based off category
                select.id=`addPostField${x.slice(0,3)}`
                label.setAttribute("for",select.id)
                form.append(label,select)

            } else{
                const input=document.createElement("input")
                input.id=`addPostField${x.slice(0,3)}`
                label.setAttribute("for",input.id)
                form.append(label,input)
            }
        }
        // declare ALL INPUT FIELDS and a button to submit form
        const postButton=document.createElement("button")
        const addPostFieldNam=document.getElementById("addPostFieldNam")
        const addPostFieldCat=document.getElementById("addPostFieldCat")
        const addPostFieldDes=document.getElementById("addPostFieldDes")
        const addPostFieldPri=document.getElementById("addPostFieldPri")
        const addPostFieldIma=document.getElementById("addPostFieldIma")
        postButton.innerText="Post!"
        // submit post button
        postButton.addEventListener("click",(e)=>{
            e.preventDefault()
            console.log("POST!!!");
            // add post fields check
            if (addPostFieldCat.value.trim() && addPostFieldNam.value.trim() && addPostFieldDes.value.trim() && addPostFieldPri.value.trim() && addPostFieldIma.value.trim()){
                console.log("all Filled");
                // ADD POST if all fields filled
                fetch("http://127.0.0.1:999/ads", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials:"include",
                body: JSON.stringify({
                    title: addPostFieldNam.value,
                    category: addPostFieldCat.value,
                    description: addPostFieldDes.value,
                    price: parseInt(addPostFieldPri.value),
                    link: addPostFieldIma.value
                    }),
                })
                .then(response => {
                    if (!response.ok) throw new Error(`Error: ${response.statusText}`)
                    return response.json()})
                .then(result =>{
                    console.log(result)
                    alert("Successfully posted!")
                })
                .catch(error=>console.error("Error Posting: ",error))       
            }else{
                console.log("not all fields filled")
            }})
        form.append(postButton)
    })
}