async function addProduct(id) {
    const cart = getCookie('cart');
    if (cart) {//Mientras haya librería temporal, es porque no hay usuario
        const response = await fetch(`/api/carts/${cart}/products/${id}`, {
            method: 'PUT'
        })
        const result = await response.json();
        console.log(result);
    } else {//Si no encontró la cookie, es porque ya hay un usuario
        const response = await fetch(`/api/carts/products/${id}`, {
            method: 'PUT'
        })
        const result = await response.json();
        console.log(result);
    }
}

function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
}