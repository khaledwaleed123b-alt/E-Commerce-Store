

/////////////////Local Storages////////


const savedTheme = localStorage.getItem("theme");
if (savedTheme) {
  document.body.classList.add(savedTheme);
  if (savedTheme === "dark") {
    const icon = document.getElementById("themeToggle").querySelector("i");
    icon.classList.replace("fa-moon", "fa-sun");
  }else{
    const icon = document.getElementById("themeToggle").querySelector("i");
    icon.classList.replace("fa-sun", "fa-moon");
  }
}else {
  document.body.classList.add("light");
}



// Model For Message Welcome
const welcomeModal = document.getElementById("welcomeModal");
const closeModalBtn = document.getElementById("closeModal");
const startExploringBtn = document.getElementById("startExploring");

// Show welcome modal when page loads
window.addEventListener("load", () => {
  setTimeout(() => {
    welcomeModal.classList.add("active");
  }, 1000);
});

// Close modal when X is clicked
closeModalBtn.addEventListener("click", () => {
  welcomeModal.classList.remove("active");
});

// Close modal and redirect when start button is clicked
startExploringBtn.addEventListener("click", () => {
  welcomeModal.classList.remove("active");
  // In a real application, you would redirect to the main page
  // window.location.href = '/dashboard';
});

//////////////////////swiper section///////////////////////////////

 var swiper = new Swiper(".mySwiper", {

      spaceBetween: 30,
      centeredSlides: true,
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
     
       pagination: {
        el: ".swiper-pagination",
        clickable: true,
      },
    });

///////////////////////nav height///////////////////////////////

window.addEventListener("load", () => {
  const nav = document.querySelector(".navbar");
  const navHeight = nav.offsetHeight;
  document.documentElement.style.setProperty("--nav-height", navHeight + "px");
});




////////////////////stars//////////////////


function generateStarRating(rate) {
  let stars = "";
  const fullStars = Math.floor(rate);
  const halfStar = rate % 1 !== 0; //3% 1 = 3

  for (let i = 0; i < fullStars; i++) {
    stars += '<i class="fa-solid fa-star" style="color: #FFD43B;"></i>';
  }

  if (halfStar) {
    stars += '<i class="fa-solid fa-star-half" style="color: #FFD43B;"></i>';
  }

  return stars;
}


/////////////////dark mode////////////////

const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const icon = themeToggle.querySelector("i");

themeToggle.addEventListener("click", () => {



  if (body.classList.contains("light")) {
    body.classList.replace("light", "dark");
    icon.classList.replace("fa-moon", "fa-sun");
     localStorage.setItem("theme","dark");
  } else {
    body.classList.replace("dark", "light");
    icon.classList.replace("fa-sun", "fa-moon");
     localStorage.setItem("theme","light");
  }
});




///////////////////////products api/////////////////////////////////


const loading = document.getElementById("loading");




let product = [];

const getProducts = async () => {
  try {
    loading.style.display = "block";

    const response = await fetch ("https://dummyjson.com/products?limit=2000");
    const data = await response.json();
    product = data.products;

    setTimeout(() => {
      loading.style.display = "none";
      displayProducts(product);
    }, 3000);

  } catch (error) {
    loading.style.display = "none";
    Swal.fire({
  icon: "error",
  title: "Oops...",
  text: "Something went wrong!",
   theme: 'auto'
});
  } };


getProducts();


function displayProducts (listOfProducts) {
  const container = document.getElementById("container");
  container.innerHTML = ""; 
  if (listOfProducts.length === 0) {
    container.innerHTML = "<p>No products found.</p>";
    return;
  }

  listOfProducts.forEach(product => {
    const productCard = document.createElement("div");
    productCard.className = "card col-4";
    productCard.style.maxWidth = "25rem";
    productCard.style.minWidth = "15rem";

    productCard.innerHTML = `
      <img src="${product.images[0]}" class="card-img-top" alt="${product.title}">
      <hr>
      <div class="card-body">
        <h5 class="card-title">${product.title}</h5>
        <p class="card-text">${product.description}</p>
        <p class="card-text">Price: $${product.price}</p>
        <p class="card-text">Category: ${product.category}</p>
        <p class="card-text">Rating: ${generateStarRating(product.rating)} (${product.rating})</p>
        <button class="add-to-cart atc" data-id="${product.id}"> <i class="fas fa-shopping-cart"></i> Add to Cart</button>
      </div>
    `;

    container.appendChild(productCard);



  });





  

};




////////////////////////Filteration////////////////////////


const categoryFilter = document.getElementById("categoryFilter");
const sortFilter = document.getElementById("sortFilter");
const searchInput = document.getElementById("searchInput");
const savedSearchValue = localStorage.getItem("searchValue");
if (savedSearchValue) {
  searchInput.value = savedSearchValue;
}

const savedCategory = localStorage.getItem("selectedCategory");
if (savedCategory) {
  categoryFilter.value = savedCategory;
}

const savedSort = localStorage.getItem("selectedSort");
if (savedSort) {
  sortFilter.value = savedSort;
}

function filterAndSortProducts() {
  let filtered = product;

  const searchValue = searchInput.value.toLowerCase().trim();
  localStorage.setItem("searchValue", searchValue);
  filtered = filtered.filter((p) =>
    p.title.toLowerCase().includes(searchValue) || p.description.toLowerCase().includes(searchValue)
  );

  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  if (selectedCategory !== "all") {
    filtered = filtered.filter(item => item.category === selectedCategory);
  }

  const selectedSort = sortFilter.value;
  localStorage.setItem("selectedSort", selectedSort);
  if (selectedSort === "price-asc") {
    filtered.sort((a,b) => a.price - b.price);
  } else if (selectedSort === "price-desc") {
    filtered.sort((a,b) => b.price -a.price);
  } else if (selectedSort === "rating-desc") {
    filtered.sort((a,b) => b.rating - a.rating);
  } else if (selectedCategory === "rating-asc") {
    filtered.sort((a,b) => a.rating - b.rating);
  }

  displayProducts(filtered);
}


categoryFilter.addEventListener("change", filterAndSortProducts);
sortFilter.addEventListener("change", filterAndSortProducts);
searchInput.addEventListener("input", filterAndSortProducts);
filterAndSortProducts();


/////////////////////Add to cart//////////////////////







let cart = JSON.parse(localStorage.getItem("cart")) || [];

const addToCart = (id) => {
  const productItem = product.find((p) => p.id == id);
  if (!productItem) return;

  const existing = cart.find((item) => item.id == id);

  if (existing) {

    Swal.fire({
      toast: true,
      position: "top-end",
      icon: "error",
      title:"المنتج موجود بالفعل في السلة  ",
      showConfirmButton: false,
      timer: 3000,
       theme: 'auto',
      footer : `<a href="cart.html">view cart</a>`
      
    });

    return false;
  }


  cart.push({ ...productItem, quantity: 1 });
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  Swal.fire({
    toast: true,
    position: "top-end",
    icon: "success",
    title: "تم اضافة المنتج بنجاح الى السلة",
    showConfirmButton: false,
    timer: 3000,
     theme: 'auto',
    footer : `<a href="cart.html">view cart</a>`
  });

  return true; 
};


    const updateCartCount = () => {
  const countElement = document.getElementById("cart-count");
  countElement.textContent = cart.length;
};
updateCartCount();


document.addEventListener("click", function (e) {
  if (e.target.classList.contains("add-to-cart")) {
    
    const btn = e.target;
    const id = btn.dataset.id;

    const added = addToCart(id); 

    if (added) {

      btn.classList.remove("atc");
      btn.classList.add("added-to-cart-btn");
      btn.innerHTML = `<i class="fas fa-shopping-cart"></i> Added to Cart`;
    }
  }
});