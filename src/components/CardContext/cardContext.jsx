import { createContext, useEffect, useState } from "react";

export const CartContext = createContext();


export const CartProvider = ({ children }) => {

    const [cartItems, setCartItems] = useState(() => {
        try {
            const savedCart = localStorage.getItem("cartItems");

            return savedCart
                ? JSON.parse(savedCart)
                : [];
        } catch {
            return [];
        }
    });


    useEffect(() => {
        localStorage.setItem(
            "cartItems",
            JSON.stringify(cartItems)
        );
    }, [cartItems]);


    const addToCart = (product) => {

        if (product.stock <= 0) {
            return;
        }

        setCartItems((prevItems) => {

            const exist = prevItems.find(
                item => item.id === product.id
            );

            if (exist) {

                // بیشتر از موجودی اجازه اضافه شدن نمی‌دهیم
                if (exist.count >= product.stock) {
                    return prevItems;
                }

                return prevItems.map(item =>
                    item.id === product.id
                        ? {
                            ...item,
                            count: item.count + 1
                        }
                        : item
                );
            }

            return [
                ...prevItems,
                {
                    ...product,
                    count: 1
                }
            ];
        });
    };


    const removeFromCart = (id) => {
        setCartItems((prevItems) =>
            prevItems.filter(
                item => item.id !== id
            )
        );
    };


    const updateCartItem = (id, newCount) => {

        setCartItems((prevItems) =>
            prevItems.map(item => {

                if (item.id !== id) {
                    return item;
                }

                const safeCount = Math.min(
                    Math.max(newCount, 1),
                    item.stock
                );

                return {
                    ...item,
                    count: safeCount
                };
            })
        );
    };


    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateCartItem,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};