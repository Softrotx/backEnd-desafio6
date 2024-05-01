const btnAddToCart = document.getElementById("btnAddToCart")
const productId = document.getElementById("productId")
let cart = sessionStorage.getItem('cart') || false
console.log(cart)
const textID = productId.textContent


btnAddToCart.addEventListener('click', async (event) =>{
    event.preventDefault()

    if(cart.length === 24){
        const addToCart = addProductToCart(cart, productId.textContent)
        console.log("se agrega el producto al carrito")
        return addToCart
        

    }else{
        const creatingCart = await newCart()
        const {createdCart} = creatingCart
        sessionStorage.setItem('cart', createdCart._id)
        cart = createdCart._id
    }




    async function newCart(){
        const response = await fetch(
                './api/carts/', {
                method:'POST',
                headers: {
        
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
            }
            )
            return response.json()

    }
    async function addProductToCart(cid, pid){
        try{
            const response = await fetch(
                `./api/carts/${cid}/products/${pid}`, {
                method:'POST',
                headers: {
        
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
            }
            )
            return response.json()

        }
        catch(err){
            console.log(err)

        }
        

    }






    


})