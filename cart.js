

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



///////////////////////nav height///////////////////////////////

window.addEventListener("load", () => {
  const nav = document.querySelector(".navbar");
  const navHeight = nav.getBoundingClientRect().height; // more reliable than offsetHeight
  document.documentElement.style.setProperty("--nav-height", `${navHeight}px`);
  console.log("Navbar height:", navHeight);
});








//////////////////////////cart/////////////////

let cart = JSON.parse(localStorage.getItem("cart")) || [];





////////////////////display///////////////////

const cartContainer = document.getElementById("cart-items");
const totalEl = document.getElementById("summaryy-total");


function displayCartContent () {

cartContainer.innerHTML = ""

 if (cart.length === 0) {
    cartContainer.innerHTML = `<p style="font-size:18px; padding:20px;">Cart is empty.</p>`;
    totalEl.textContent = "$0.00";
    return;
  }

 cart.forEach((item , index) => {
    const div = document.createElement("div");
    div.className = "cart-itemss";

    div.innerHTML = `
      <div class="product-infoo col-4">
       <center> <img src="${item.images[0]}" alt="${item.title}" class="product-imagee" />
        <div class="product-detailss">
          <h3>${item.title}</h3>
          <p>${item.category}</p>
        </div></center>
      </div>

      <div class="pricee line col-2">$${item.price}</div>

      <div class="quantity-controlss line col-3">
        <button class="quantity-btns" onclick="decrease(${index})">
          <i class="fas fa-minus"></i>
        </button>

        <input type="text" class="quantity-inputs" value="${
          item.quantity || 1
        }" disabled />

        <button class="quantity-btns" onclick="increase(${index})">
          <i class="fas fa-plus"></i>
        </button>
      </div>

      <div class="price col-2">
        <button class="remove-btns" onclick="removeItem(${index})">
          <i class="fas fa-trash"></i>
        </button>
      </div>
    `;

    cartContainer.appendChild(div);
    updateSummary();
  });


}





function updateSummary() {
  let total = 0;
  for (const item of cart) {
    total += item.price * item.quantity ;
  }
  totalEl.textContent = `Total : $${total.toFixed(2)}`;
}


function increase (index) {

cart[index].quantity = cart[index].quantity + 1 ;
saveCart();
}


function decrease (index) {
if (cart[index].quantity > 1) {
cart[index].quantity = cart[index].quantity - 1 ;
}else{
  return;
}
saveCart();
}


function removeItem (index) {

Swal.fire({
  title: "Are you sure?",
  text: `${cart[index].title} will be deleted from your Cart`,
  icon: "warning",
  showCancelButton: true,
  confirmButtonColor: "#3085d6",
  cancelButtonColor: "#d33",
  confirmButtonText: "Yes, delete it!",
  theme: 'auto'
}).then((result) => {
  if (result.isConfirmed) {
    cart.splice(index , 1);
    saveCart();
    Swal.fire({
      title: `${cart[index].title} is Deleted!`,
      text: "Your item has been deleted.",
      icon: "success",
      theme: 'auto'
    });
  }
});




}









function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
displayCartContent();
}




const checkout = document.getElementById("checkout")

checkout.addEventListener("click", () => {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  if (cart.length === 0) {
    Swal.fire({
      title: "Your cart is empty!",
      icon: "error",
      theme: "auto"
    });
    return;
  }

  Swal.fire({
    title: "Are you sure you want to buy?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    theme: "auto",
    confirmButtonText: "Buy Now!"
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("cart"); // clear cart
      Swal.fire({
        title: "Bought Successfully!",
        icon: "success",
        timer: 1500,
        theme: "auto",
        showConfirmButton: false
      }).then(() => {
        window.location.href = "HomePage.html"; // redirect after success
      });
    }
  });
});






displayCartContent();