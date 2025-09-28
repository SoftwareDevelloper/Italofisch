import React, { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { toast, ToastContainer, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Done from '../../assets/check.png'
import { useTranslation } from "react-i18next";
const stripePromise = loadStripe("pk_test_51S6v8IE7v8OATBnbBlVtlm8bPfSmp0XGNkKsvmzzhgmHaV9Uy5dQimI7pkzR0pLx3gvKJJZ4Rj6YSpPFZkG8B1aR00cb28Gd7t");
const API_URL = "http://localhost:4000";

const CheckoutForm = () => {
  const { t, i18n } = useTranslation()
  const currentLanguage = i18n.language; 
  useEffect(()=>{
    window.document.dir = i18n.dir();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[currentLanguage])
  const [step, setStep] = useState(1); // 1=Cart, 2=Address, 3=Payment, 4=Confirmation
  const [items, setItems] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: "",
    phone: "",
    email: "",
    street: "",
    apartment: "",
    city: "",
    postalCode: "",
    country: ""
  });
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    const fetchCart = async () => {
      const token = localStorage.getItem("auth-token");
      try {
        const res = await fetch(`${API_URL}/getCart`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          const mappedItems = data.cart.map((item) => ({
            productId: item.id,
            name: item.name,
            price: item.newPrice || item.price,
            quantity: item.quantity,
            weight: item.weight || 1,
          }));
          setItems(mappedItems);
        }
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    fetchCart();
  }, []);

  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalWeight =  items.reduce((total, item) => total + item.weight * item.quantity, 0);

  const placeOrder = async () => {
    const token = localStorage.getItem("auth-token");
    let paymentIntentId = null;

    if (selectedPaymentMethod === "stripe") {
      try {
        const paymentIntentRes = await fetch(`${API_URL}/createPaymentIntent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ totalPrice }),
        });

        const paymentIntentData = await paymentIntentRes.json();

        const result = await stripe.confirmCardPayment(paymentIntentData.clientSecret, {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: {
              name: deliveryAddress.name,
              phone: deliveryAddress.phone,
              email: deliveryAddress.email,
              address: {
                line1: deliveryAddress.street,
                line2: deliveryAddress.apartment || "",
                city: deliveryAddress.city,
                postal_code: deliveryAddress.postalCode,
                country: deliveryAddress.country,
              },
            },
          },
        });

        if (result.error) {
          toast.error("Payment failed: " + result.error.message);
          return;
        }

        if (result.paymentIntent.status !== "succeeded") {
          toast.error("Payment not completed");
          return;
        }

        paymentIntentId = result.paymentIntent.id;
      } catch (error) {
        console.error("Stripe payment error:", error);
        toast.error("Payment processing failed");
        return;
      }
    }

    const orderRes = await fetch(`${API_URL}/PlaceOrder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        cartItems: items,
        totalPrice,
        deliveryAddress,
        paymentMethod: selectedPaymentMethod,
        paymentIntentId,
      }),
    });

    const orderData = await orderRes.json();
    if (orderData.success) {
      toast.success("Order placed successfully!");
      const clearRes = await fetch(`${API_URL}/ClearCart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
       const clearData = await clearRes.json();
       if(clearData.success){
        setItems([]);
      }
      setStep(4);
    } else {
      toast.error(orderData.error || "Failed to place order");
    }
  };
  const StepIndicator = () => {
    const steps = ["Cart", "Address", "Payment", "Confirmation"];
    return (
      <div className="flex justify-between mb-6 py-5 text-white">
        {steps.map((label, idx) => (
          <div key={idx} className="flex-1 text-center relative">
            <div className={`mx-auto w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= idx + 1 ? "bg-cyan-600 text-white" : "bg-gray-300 text-gray-600"}`}>
              {idx + 1}
            </div>
            <span className="absolute top-10 left-1/2 -translate-x-1/2 text-sm">{label}</span>
            {idx !== steps.length - 1 && <div className={`absolute top-3 left-1/2 w-full h-1 bg-gray-300 ${step > idx + 1 ? "bg-cyan-600" : ""}`} style={{ zIndex: -1 }}></div>}
          </div>
        ))}
      </div>
    );
  };
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={true}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Zoom}
      />
      <StepIndicator />
      {step === 1 && (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col space-y-4">
          <h2 className="text-cyan-800 text-2xl font-bold text-center"> {t('step1')} </h2>
          {items.length === 0 ? (
            <div className="text-gray-400 text-center font-medium py-8 text-lg"> {t('empty')} </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border-collapse text-cyan-900">
                <thead>
                  <tr className="border-b bg-cyan-50 font-semibold text-lg cursor-pointer">
                    <th className="px-4 py-2"> {t('Product')} </th>
                    <th className="px-4 py-2"> {t('Qty')} </th>
                    <th className="px-4 py-2"> {t('Price')} </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item.productId} className=" bg-cyan-50  font-medium text-shadow-md hover:bg-cyan-100 transition duration-200">
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2">{item.quantity}</td>
                      <td className="px-4 py-2">{item.price * item.quantity}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <div className="flex justify-between font-semibold text-lg pt-2 text-cyan-900 mt-4  ">
            <span> {t('total')} </span> <span>{totalPrice} €</span>
          </div>
          <div className="flex justify-between font-semibold text-cyan-900 mt-4 ">
            <span> {t('weight')} </span> <span>{totalWeight} Kg</span>
          </div>
          <button
            onClick={() => setStep(2)}
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 px-6 rounded-lg transition">
            {t('Next')}
          </button>
        </div>
      )}
      {step === 2 && (
        <div className="bg-white rounded-xl shadow-md p-6 grid gap-4">
          <h2 className="text-cyan-600 text-2xl font-bold text-center"> {t('step2')} </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(deliveryAddress).map(([key, value]) => (
              <input
                key={key}
                className="border rounded-lg p-2 w-full"
                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                value={value}
                onChange={(e) => setDeliveryAddress({ ...deliveryAddress, [key]: e.target.value })}
              />
            ))}
          </div>
          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(1)} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"> {t('Back')} </button>
            <button onClick={() => setStep(3)} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"> {t('Next')} </button>
          </div>
        </div>
      )}
      {step === 3 && (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col space-y-4">
          <h2 className="text-cyan-600 text-2xl font-bold text-center"> {t('step3')} </h2>
          <select
            className="border rounded-lg p-2 w-full"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
          >
            <option value=""> {t('method')} </option>
            <option value="cash"> {t('cash')} </option>
            <option value="stripe"> {t('card')} </option>
          </select>
          {selectedPaymentMethod === "stripe" && <CardElement className="border p-2 rounded-lg" />}

          <div className="flex justify-between mt-4">
            <button onClick={() => setStep(2)} className="bg-gray-200 hover:bg-gray-300 px-4 py-2 rounded-lg"> {t('Back')} </button>
            <button onClick={placeOrder} className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg"> {t('place')} </button>
          </div>
        </div>
      )}
      {step === 4 && (
        <div className="bg-white rounded-xl shadow-md p-6 flex flex-col items-center space-y-4">
          <img src={Done} className="w-24 h-24" alt="Success"/>
          <p className="text-green-600 text-xl font-semibold text-center"> {t('step4')} </p>
        </div>
      )}
    </div>
  );
};
const Checkout = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);

export default Checkout;