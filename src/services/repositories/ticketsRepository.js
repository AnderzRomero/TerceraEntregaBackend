export default class TicketsRepository {
    constructor(dao) {
        this.dao = dao;
    }
    createTicket = (cartId, productId, quantity) => {
        return this.dao.createTicket(cartId, productId, quantity);
    }
}