
// window.deletePost = deletePost;
// window.editPost = editPost;
// window.toggleFavorite = toggleFavorite;

// Handler functions for the buttons
async function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
      try {
        const response = await fetch(`http://127.0.0.1:999/ads/${postId}`, {
          method: 'DELETE',
        });
        if (response.ok) {
          // Remove the post from UI
          document.querySelector(`[data-post-id="${postId}"]`).remove();
          displayPosts()
          alert("Post deleted!")
        } else {
          throw new Error('Failed to delete post');
        }
      } catch (error) {
        console.error('Error deleting post:', error);
        alert('Failed to delete post');
      }
    }
  }
  
  
  function editPost(postId) {
    const targetCard=document.getElementById(postId)
  
     // Get current values
      const currentTitle = targetCard.querySelector('.card-header h2')?.textContent;
      const currentDesc = targetCard.querySelector('.card-content p')?.textContent;
      const currentPrice = targetCard.querySelector('.card-footer .price')?.textContent.replace(/[^0-9]/g, '');
      const currentImage = targetCard.querySelector('.card-image img')?.src;
      
      //DEBUG
      console.log("Current Title:", currentTitle);
      console.log("Current Description:", currentDesc);
      console.log("Current Price:", currentPrice);
      console.log("Current Image:", currentImage);
      console.log("target Card:", targetCard.outerHTML)
  
      //DEBUG
  
      // Create image input and preview container
      const imageContainer = targetCard.querySelector('.card-image');
      imageContainer.textContent = ''; // Clear existing
      
      const imageInput = document.createElement('input');
      imageInput.type = 'url';
      imageInput.value = currentImage;
      imageInput.className = 'edit-image';
      imageInput.placeholder = 'Enter image URL';
      
      // Create preview image
      const imagePreview = document.createElement('img');
      imagePreview.src = currentImage;
      imagePreview.alt = 'Preview';
      
      // Update preview when URL changes
      imageInput.addEventListener('change', (e) => {
          imagePreview.src = e.target.value;
      });
      
      imageContainer.appendChild(imagePreview);
      imageContainer.appendChild(imageInput);
      
      // Rest of the edit form (title, description, price)
      let titleInput = document.createElement('input');
      titleInput.type = 'text';
      titleInput.value = currentTitle;
      titleInput.className = 'edit-title';
      
      const descTextarea = document.createElement('textarea');
      descTextarea.value = currentDesc;
      descTextarea.className = 'edit-description';
      
      const priceInput = document.createElement('input');
      priceInput.type = 'number';
      priceInput.value = currentPrice;
      priceInput.className = 'edit-price';
      
      // Clear and append elements
      const titleContainer = targetCard.querySelector('.card-header h2');
      titleContainer.textContent = '';
      titleContainer.appendChild(titleInput);
      
      const descContainer = targetCard.querySelector('.card-content p');
      descContainer.textContent = '';
      descContainer.appendChild(descTextarea);
      
      const priceContainer = targetCard.querySelector('.card-footer .price');
      priceContainer.textContent = '';
      priceContainer.appendChild(priceInput);
  
      
      // Create control buttons
      const controls = targetCard.querySelector('.card-controls');
      controls.textContent = '';
      
      const saveBtn = document.createElement('button');
      saveBtn.textContent = 'Save';
      saveBtn.className = 'save-btn';
      saveBtn.addEventListener('click',async(e)=>{
          console.log("save button clicked")
          try {
          const response = await fetch(`http://127.0.0.1:999/ads/${postId}`, {
              method: "PUT",
              headers: {
                  "Content-Type": "application/json"
              },
              credentials:"include",
              body: JSON.stringify({
                  title:titleInput.value,
                  description:descTextarea.value,
                  price:priceInput.value,
                  link:imageInput.value
              })
          });
  
          if (!response.ok) {
              throw new Error("Failed to update ad");
          }
  
          const updatedAd = await response.json();
          console.log("Ad updated successfully:", updatedAd);
          //return updatedAd;
  
          await displayPosts()
      } catch (error) {
          console.error("Error updating ad:", error);
      }
      })
      
      const cancelBtn = document.createElement('button');
      cancelBtn.textContent = 'Cancel';
      cancelBtn.className = 'cancel-btn';
      cancelBtn.addEventListener("click",async()=>{
  
          await displayPosts()
      })
      
      controls.appendChild(saveBtn);
      controls.appendChild(cancelBtn);
      console.log("edit btn fnc end")
  }
  
  
  export async function displayPosts(type=0) {
      console.log("displaying posts");
      let currentUser = null;
      let posts = null;
  
      try {
          const mainContainer = document.getElementById('mainContainer');
          if (!mainContainer) throw new Error("Main container not found");
  
          mainContainer.removeEventListener('click', handleCardActions);
          
          const [authResponse, postsResponse] = await Promise.all([
              fetch("http://127.0.0.1:999/auth/verify", {
                  method: "GET",
                  credentials: "include"
              }),
              fetch("http://127.0.0.1:999/ads", {
                  credentials: "include" // Add this to get favorite status
              })
          ]);
  
          if (!authResponse.ok) throw new Error("User not authenticated");
          if (!postsResponse.ok) throw new Error("Failed to fetch posts");
          
          currentUser = await authResponse.json();
          posts = await postsResponse.json();
  
          //DEBUG
          console.log(posts)
  
          
  
          mainContainer.classList.add("postsContainer");
          mainContainer.innerHTML = ''; // Clear is fine here as it's our controlled container
  
          posts.forEach(post => {
              if (type===1){
                  if (post.isFavoritedBy){
                      const card = createPostCard(post, currentUser);
                      mainContainer.appendChild(card);
                  }
              }else if (type===0){
                  const card = createPostCard(post, currentUser);
                  mainContainer.appendChild(card);
              }else if(post.category===type){
                  const card = createPostCard(post, currentUser);
                  mainContainer.appendChild(card);
              }
              
          });
  
          // Add event listeners
          mainContainer.addEventListener('click', handleCardActions);
  
      } catch (error) {
          console.error("Error in displayPosts:", error);
      }
      if(mainContainer.innerHTML===""){
          const emptyText=document.createElement("h2")
          emptyText.innerText="No Posts were found!"
          mainContainer.append(emptyText)
      }
  }
  
  function createPostCard(post, currentUser) {
      const card = document.createElement('div');
      card.className = 'card';
      card.id = post._id;
  
      const isAuthorized = currentUser.role === 'admin' || currentUser._id === post.user;
  
      // Image container
      const imageContainer = document.createElement('div');
      imageContainer.className = 'card-image';
      const img = document.createElement('img');
      img.src = isValidUrl(post.link) ? post.link : 
          `https://placehold.co/600x400?text=${encodeURIComponent(post.title || 'No Image')}`;
      img.alt = post.title;
      imageContainer.appendChild(img);
  
      // Header
      const header = document.createElement('div');
      header.className = 'card-header';
      const title = document.createElement('h2');
      title.textContent = post.title;
      header.appendChild(title);
  
      if (post.createdAt) {
          const date = document.createElement('p');
          date.className = 'date';
          date.textContent = new Date(post.createdAt).toLocaleDateString();
          header.appendChild(date);
      }
  
      // Content
      const content = document.createElement('div');
      content.className = 'card-content';
      const description = document.createElement('p');
      description.textContent = post.description;
      content.appendChild(description);
  
      // Footer
      const footer = document.createElement('div');
      footer.className = 'card-footer';
      const price = document.createElement('p');
      price.className = 'price';
      price.textContent = `${post.price.toLocaleString()} €`;
      footer.appendChild(price);
  
      // Controls
      const controls = document.createElement('div');
      controls.className = 'card-controls';
  
      if (isAuthorized) {
          const editBtn = createButton('edit-btn', 'Edit', post._id);
          const deleteBtn = createButton('delete-btn', 'Delete', post._id);
          controls.appendChild(editBtn);
          controls.appendChild(deleteBtn);
      } else {
          const favoriteBtn = createButton(
              'favorite-btn', 
              post.isFavoritedBy ? '❤️ Favorited' : '♡ Favorite',
              post._id
          );
          favoriteBtn.id = `fav-${post._id}`;
          if (post.isFavoritedBy) {
              favoriteBtn.classList.add('favorited');
          }
          controls.appendChild(favoriteBtn);
      }
  
      // Append all sections
      card.appendChild(imageContainer);
      card.appendChild(header);
      card.appendChild(content);
      card.appendChild(footer);
      card.appendChild(controls);
  
      return card;
  }
  
  function createButton(className, text, postId) {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = className;
      button.textContent = text;
      button.dataset.postId = postId;
      return button;
  }
  
  function isValidUrl(urlString) {
      try {
          return Boolean(new URL(urlString));
      } catch (e) {
          return false;
      }
  }
  
  async function handleCardActions(event) {
      const postId = event.target.dataset.postId;
      if (!postId) return;
      
      event.preventDefault();
      
      if (event.target.classList.contains('delete-btn')) {
          deletePost(postId);
      } else if (event.target.classList.contains('edit-btn')) {
          editPost(postId);
      } else if (event.target.classList.contains('favorite-btn')) {
          await toggleFavorite(postId, event.target);
      }
  }
  
  async function toggleFavorite(postId, button) {
      try {
          const response = await fetch(`http://127.0.0.1:999/ads/${postId}/favorite`, {
              method: 'POST',
              credentials: 'include',
              headers: {
                  'Content-Type': 'application/json'
              }
          });
  
          if (!response.ok) throw new Error('Failed to toggle favorite');
          
          const data = await response.json();
          console.log("data",data)
  
          //DEBUG
          console.log("fav stat:", data.isFavorited)
          
          // Update button appearance
          button.textContent = data.isFavorited ? '❤️ Favorited' : '♡ Favorite';
          button.classList.toggle('favorited', data.isFavorited);
          
      } catch (error) {
          console.error('Error toggling favorite:', error);
          alert('Failed to update favorite status');
      }
  }