import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

const MyOrders = () => {
  const [orders, setOrders] = useState([]);
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentLanguage])
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("auth-token");
      if (!token) return setOrders([]);
      const res = await fetch("http://localhost:4000/GetOrders", {
        method: "GET",
        headers: {
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
          'Content-Type': "application/json",
        },
      });
      const data = await res.json();
      if (data.success) setOrders(data.orders || []);
      else setOrders([]);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);
  return (
    <div className="min-h-screen py-10 px-4 bg-transparent text-white">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center mb-8 tracking-wide"> {t('Myorders')} </h1>

      {orders.length === 0 ? (
        <p className="text-center text-lg font-semibold text-[#90e0ef]"> {t('no')} </p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse rounded-lg overflow-hidden shadow-lg">
            <thead className="bg-[#0077b6] text-white text-sm md:text-base">
              <tr>
                <th className="px-4 py-2 text-left"> {t('Id')} </th>
                <th className="px-4 py-2 text-left"> {t('Date')} </th>
                <th className="px-4 py-2 text-left"> {t('Total')} </th>
                <th className="px-4 py-2 text-left"> {t('Status')} </th>
                <th className="px-4 py-2 text-left"> {t('Items')} </th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="bg-[#003566] hover:bg-[#0077b6]/50 transition-colors text-sm md:text-base">
                  <td className="px-4 py-2 break-words">{order._id}</td>
                  <td className="px-4 py-2">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="px-4 py-2">{order.totalPrice.toFixed(2)} €</td>
                  <td className="px-4 py-2">
                    <span className={`px-2 py-1 rounded-full font-semibold text-xs md:text-sm ${
                      order.paymentStatus === "Paid" ? "bg-[#90e0ef] text-[#003566]" : "bg-[#0077b6]/50 text-white"
                    }`}>
                      {order.paymentStatus}
                    </span>
                  </td>
                  <td className="px-4 py-2">
                    <ul className="list-disc list-inside space-y-1">
                      {order.cartItems.map((item, index) => (
                        <li key={index}>{item.name} x {item.quantity}</li>
                      ))}
                    </ul>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default MyOrders;
