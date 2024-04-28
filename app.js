let cartOverlay = document.querySelector(".cart-overlay");
let cartItem = document.querySelector(".cart-item");
let removeItems = document.querySelectorAll(".remove-items");
let cartTotal = document.querySelector(".cart-total");
let clearCart = document.querySelector(".clear-cart");
let cartNum = document.querySelector(".cart-num");
let cartContent = document.querySelector(".cart-content");
let cartDOM = document.querySelector(".cart");
let ourProducts = document.querySelector(".ourProducts");
let shopCart = document.querySelector(".shopCart");
let closeCart = document.querySelector(".close-cart");

let cart = [];
class Products {
  async getProducts() {
    try {
      let result = await fetch("products.json");
      let data = await result.json();
      let products = data.items.map((item) => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { id, title, price, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  }
}

class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((product) => {
      result += `  <div class="pro-img">
             <div class="forBtn">
               <img class="toShow" src=${product.image} alt="" />
               <button class="addBtn" data-id=${product.id}>Add to cart</button>
             </div>
             <h3>${product.title}</h3>
             <span>$${product.price}</span>
           </div>`;
    });
    ourProducts.innerHTML = result;
  }
  getCartBtns() {
    let cartBtns = [...document.querySelectorAll(".addBtn")];
    let buttonsDOM = cartBtns;
    cartBtns.forEach((cartBtn) => {
      let id = cartBtn.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        cartBtn.addEventListener("click", (event) => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;
        });
      }
      {
        cartBtn.addEventListener("click", (event) => {
          event.target.innerText = "In Cart";
          event.target.disabled = true;
          let cartItem = { ...Storage.getProduct(id), amount: 1 };
          // cart = [...cart,cartItem]
          cart.push(cartItem);
          Storage.saveCart(cart);
          this.cartSetValues(cart);
          this.addCartItem(cartItem);
          this.showCart();
        });
      }
    });
  }
  cartSetValues(cart) {
    let tempVal = 0; // temporary value
    let itemNum = 0;
    cart.map((item) => {
      tempVal += item.price * item.amount;
      // itemNum += item.amount
    });
    cartTotal.innerText = parseFloat(tempVal.toFixed(2));
    // cartItems.innerText = itemNum
  }
  addCartItem(item) {
    // console.log(item.image);
    let div = document.createElement("div");
    div.classList.add("cart-item");
    div.innerHTML = `<img src=${item.image} alt="" />
    <div>
      <h4>${item.title}</h4>
      <h4>$${item.price}</h4>
      <span class="remove-items" data-id=${item.id}>remove</span>
    </div>
    <div>
      <i class="fas fa-chevron-up" data-id=${item.id}></i>
      <p class="cart-num">${item.amount}</p>
      <i class="fas fa-chevron-down" data-id=${item.id}></i>
    </div>`;
    cartContent.appendChild(div);
    // console.log(cartContent);
  }
  showCart() {
    cartOverlay.classList.add("showCart");
  }
  setUpApp() {
    cart = Storage.getCart();
    this.cartSetValues(cart);
    this.populateCart(cart);
    this.nullBtn();
    shopCart.addEventListener("click", () => {
      this.showCart();
      closeCart.addEventListener("click", () => {
        this.hideCart();
      });
    });
  }
  nullBtn() {
    let cartBtns = [...document.querySelectorAll(".addBtn")];
    cartBtns.forEach((cartBtn) => {
      let id = cartBtn.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        cartBtn.innerText = "In Cart";
        cartBtn.disabled = true;
      }
    });
  }

  hideCart() {
    cartOverlay.classList.remove("showCart");
  }
  populateCart(cart) {
    cart.forEach((item) => {
      this.addCartItem(item);
    });
  }
  cartLogic() {
    clearCart.addEventListener("click", () => {
      this.clearCart();
    });
    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("remove-items")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        cart = cart.filter((item) => item.id != id);
        this.cartSetValues(cart);
        Storage.saveCart(cart);
        let buttons = this.getSingleBtn(id);
        buttons.disabled = false;
        buttons.innerHTML = "Add to cart";
        cartContent.removeChild(removeItem.parentElement.parentElement);
      } else if (
        event.target.classList.contains("fas") &&
        event.target.classList.contains("fa-chevron-up")
      ) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
       tempItem.amount =  tempItem.amount + 1

       
        Storage.saveCart(cart);
        this.cartSetValues(cart);
        event.target.nextElementSibling.innerText = tempItem.amount;
      }else if(event.target.classList.contains("fa-chevron-down"))

      {
        let decreaseAmnt = event.target;
        let id = decreaseAmnt.dataset.id;
        let tempNum = cart.find((item) => item.id === id);
       tempNum.amount =  tempNum.amount - 1

       
        Storage.saveCart(cart);
        this.cartSetValues(cart);
        event.target.previousElementSibling.innerText = tempNum.amount;
        if(tempNum.amount<1){
          cart = cart.filter((item) => item.id != id);
          this.cartSetValues(cart);
          Storage.saveCart(cart);
          let buttons = this.getSingleBtn(id);
          buttons.disabled = false;
          buttons.innerHTML = "Add to cart";
          cartContent.removeChild(decreaseAmnt.parentElement.parentElement);
          console.log(decreaseAmnt.parentElement.parentElement)

        }


      }
    });
  }

  clearCart() {
    let cartItems = cart.forEach((item) => {
      let id = item.id;
      this.removeCartItem(id);
    });
    //  while (cartContent.children.length>0) {
    //   cartContent.removeChild(cartContent.children[0])

    //  }
    if (cartContent.children.length > 0) {
      // Remove all children
      cartContent.innerHTML = "";
    }
  }
  removeCartItem(id) {
    cart = cart.filter((item) => item.id != id);
    this.cartSetValues(cart);
    Storage.saveCart(cart);
    let buttons = this.getSingleBtn(id);
    buttons.disabled = false;
    buttons.innerHTML = "Add to cart";

    cart = [];
    this.hideCart();
  }

  getSingleBtn(id) {
    let cartBtns = document.querySelectorAll(".addBtn");

    return Array.from(cartBtns).find((item) => item.dataset.id === id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }
  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem("products"));
    return products.find((product) => product.id === id);
  }
  static saveCart(cart) {
    return localStorage.setItem("cart", JSON.stringify(cart));
  }
  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  let ui = new UI();
  let products = new Products();
  ui.setUpApp();
  products
    .getProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getCartBtns();
      ui.nullBtn();
      ui.cartLogic();
    });
});
   