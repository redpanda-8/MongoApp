import { displayPosts } from "./displayPosts.js";
const container=document.getElementById("mainContainer")
async function displayCategories() {
    try {
        const response = await fetch("http://127.0.0.1:999/category");
        const categories = await response.json();
        
        const existingForm = document.getElementById("CATEGORIES");
        if (existingForm) {
            existingForm.remove();
        }

        const categoryListForm = document.createElement("form");
        categoryListForm.id = "CATEGORIES";
        container.append(categoryListForm);

        categories.forEach(category => {
            const categoryContainer = document.createElement("div");
            categoryContainer.id = `categoryList`;
            
            const categoryName = document.createElement("h5");
            categoryName.innerText = category.name;
            
            const categoryDelBtn = document.createElement("button");
            categoryDelBtn.className = 'removeCategory';
            categoryDelBtn.innerText = "Remove";
            
            categoryContainer.append(categoryName, categoryDelBtn);
            categoryListForm.append(categoryContainer);

            categoryDelBtn.addEventListener("click", async (e) => {
                e.preventDefault();
                try {
                    const response = await fetch(`http://127.0.0.1:999/category/${category._id}`, {
                        method: "DELETE"
                    });
                    
                    if (response.ok) {
                        alert(`Category ${category.name} removed.`);
                        displayCategories(); // Refresh the list
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error("Error deleting category:", error);
                    alert("Failed to delete category");
                }
            });
        });
    } catch (error) {
        console.error("Error fetching categories:", error);
}};
async function displayUsers() {
    try {
        container.innerHTML=""
        const response = await fetch("http://127.0.0.1:999/users");
        const users = await response.json();
        
        const existingTable = document.getElementById("USERS_TABLE");
        if (existingTable) {
            existingTable.remove();
        }

        // Create table
        const table = document.createElement("table");
        table.id = "USERS_TABLE";
        table.className = "users-table";

        // Create header
        const thead = document.createElement("thead");
        thead.innerHTML = `
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Status</th>
                <th>Created At</th>
                <th>Actions</th>
            </tr>
        `;
        table.appendChild(thead);

        // Create table body
        const tbody = document.createElement("tbody");
        
        users.forEach(user => {
            const tr = document.createElement("tr");
            const createdAt = new Date(user.createdAt).toLocaleDateString();
            
            tr.innerHTML = `
                <td>${user.name}</td>
                <td>${user.email}</td>
                <td>${user.isBlocked ? '<span class="blocked">Blocked</span>' : '<span class="active">Active</span>'}</td>
                <td>${createdAt}</td>
                <td class="action-buttons"></td>
            `;

            // Create action buttons
            const actionCell = tr.querySelector('.action-buttons');
            
            // Block/Unblock button
            const blockBtn = document.createElement("button");
            blockBtn.className = user.isBlocked ? 'unblock-btn' : 'block-btn';
            blockBtn.innerText = user.isBlocked ? 'Unblock' : 'Block';
            
            // Delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.className = 'delete-btn';
            deleteBtn.innerText = 'Delete';

            actionCell.append(blockBtn, deleteBtn);
            tbody.appendChild(tr);

            // Block/Unblock handler
            blockBtn.addEventListener("click", async () => {
                try {
                    const response = await fetch(`http://127.0.0.1:999/users/${user._id}/toggle-block`, {
                        method: "PUT"
                    });
                    
                    if (response.ok) {
                        const result = await response.json();
                        alert(result.message);
                        displayUsers(); // Refresh the list
                    } else {
                        const error = await response.json();
                        alert(`Error: ${error.message}`);
                    }
                } catch (error) {
                    console.error("Error toggling user block status:", error);
                    alert("Failed to update user status");
                }
            });

            // Delete handler
            deleteBtn.addEventListener("click", async () => {
                if (confirm(`Are you sure you want to delete user ${user.username}?`)) {
                    try {
                        const response = await fetch(`http://127.0.0.1:999/users/${user._id}`, {
                            method: "DELETE"
                        });
                        
                        if (response.ok) {
                            alert(`User ${user.username} deleted successfully`);
                            displayUsers(); // Refresh the list
                        } else {
                            const error = await response.json();
                            alert(`Error: ${error.message}`);
                        }
                    } catch (error) {
                        console.error("Error deleting user:", error);
                        alert("Failed to delete user");
                    }
                }
            });
        });

        table.appendChild(tbody);
        document.getElementById("mainContainer").appendChild(table);

    } catch (error) {
        console.error("Error fetching users:", error);
        alert("Failed to load users");
    }
}

export const adminRole=()=>{
    let currentUser=null
    fetch("http://127.0.0.1:999/auth/verify",{
        method: "GET",
        credentials: "include"
    })
    .then((res)=>{
        if(res.ok) return res.json();
        else throw new Error("User not authenticated")
    })
    .then(user=>{
        currentUser=user
    })
    const header=document.getElementById("header")
    container.innerText="ADMIN"
    const createCategoryBtn=document.createElement("button")
    createCategoryBtn.innerText="Create category"
    const showUsersBtn=document.createElement("button")
    showUsersBtn.innerText="Show users"
    showUsersBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        displayUsers()
    })
    const showPostsBtn=document.createElement("button")
    showPostsBtn.innerText="Show posts"
    header.append(createCategoryBtn,showUsersBtn,showPostsBtn)

    showPostsBtn.addEventListener("click",async(e)=>{
      displayPosts()
    })

    createCategoryBtn.addEventListener("click",(e)=>{
        e.preventDefault()
        container.innerHTML=""
        const addCatForm = document.createElement("form");
        addCatForm.id ="addCatForm"
        const label = document.createElement("label");
        label.innerText = "Category name";
        const input = document.createElement("input");
        const addCatBtn = document.createElement("button");
        addCatBtn.innerText = "Add new category";
        addCatForm.append(label, input, addCatBtn);
        container.append(addCatForm);
        console.log("ADMIN NEW CATEGORY");
        displayCategories()
        
        addCatBtn.addEventListener("click",async(e)=>{
            e.preventDefault();
            console.log("add new category");
            const name=input.value
            console.log(name)
            if(name){
                try{
                    const response = await fetch("http://127.0.0.1:999/category", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",

                },
                body: JSON.stringify({name:name}),
            });
            const result = await response.json();
            console.log(result);
            displayCategories()
                }catch(error){
                    console.log(error)
                }
            }else console.log("no category entered")
        })
    })
}
