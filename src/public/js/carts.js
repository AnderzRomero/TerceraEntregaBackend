async function buy_cart(id, total) {
    const cart = localStorage.getItem('accessToken');
    if (cart) {//Mientras haya carrito temporal, es porque no hay usuario
        console.log("No se ha logeado para realizar la compra");
    } else {//Si no encontró la cookie, es porque ya hay un usuario
        let cartId = `${id}`;
        let sumTotalPrice = `${total}`;

        const url = '/api/carts/' + cartId + '/purchase';

        const requestOptions = {
            method: 'POST',
            body: JSON.stringify({ sumTotalPrice: sumTotalPrice }),
            headers: {
                'Content-Type': 'application/json',
            }
        };

        fetch(url, requestOptions)
            .then(response => {
                return response.text();
            })
            .then(result => {
                if (result === "Compra exitosa") {
                    alert("whyt?")
                }
            })
            .catch(error => {
                console.log(error)
            });
    }
}