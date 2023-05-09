import { useContext } from "react";
import { ProductsContext } from "../../context/ProductsContext";
import { Button } from "../Button";
import { StyledCartTotal } from "./style";
import { decreaseStock, getProductById } from "../../services/products";
import { UserContext } from "../../context/UserContext";
import { removeItemCart } from "../../services/cart";

export const CartTotal = () => {
  const { cartList, setCartList, setShowCart } = useContext(ProductsContext);
  const { reloadRender, setReloadRender } = useContext(UserContext);
  const cartSum = cartList.reduce(
    (acc, current) => acc + current.value * current.quantity,
    0
  );
  const formattedTotal = cartSum.toLocaleString("pt-br", {
    style: "currency",
    currency: "BRL",
  });

  const cleanCart = () => {
    cartList.map(async (item) => {
      await removeItemCart(item.cart_id);
    });

    setCartList([]);
    setShowCart(false);
  };

  const closeOrder = async () => {
    await Promise.all(
      cartList.map(async (item) => {
        const getProduct = await getProductById(item.id);
        const newStock = getProduct.stock - item.quantity;
        await decreaseStock(item.id, newStock);
      })
    );
    cleanCart();
    setReloadRender(!reloadRender);
  };

  return (
    <StyledCartTotal>
      <div>
        <h3 className="font-heading-4">Total</h3>
        <span className="font-body-600-gray">{formattedTotal}</span>
      </div>
      <div>
        <Button
          size="medium"
          color="gray"
          content="Remover Todos"
          onClick={() => cleanCart()}
        />
        <Button
          size="medium"
          onClick={async () => await closeOrder()}
          content="Finalizar Pedido"
          color={"primary"}
        />
      </div>
    </StyledCartTotal>
  );
};
