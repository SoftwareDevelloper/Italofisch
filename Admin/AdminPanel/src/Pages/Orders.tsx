import { useEffect, useState } from "react";
interface Order {
  _id: number; 
  userId: number;
  cartItems: {
    productId: number;
    name: string;
    quantity: number;
    weight: number;
    price: number;
  }[];
  totalPrice: number;
  paymentMethod: string;
  paymentStatus: string; 
}

interface User {
  id: number;
  fullname: string;
}

interface TableRowProps {
  orderId: number;
  customer: string;
  product: string;
  quantity: number;
  amount: number;
  payment: string;
  paymentStatus?: "Paid" | "Pending" | "Failed";
}

const TableRow = ({ orderId, customer, product, quantity, amount, payment, paymentStatus }: TableRowProps) => (
  <tr className="bg-white hover:bg-blue-300 cursor-pointer hover:text-white hover:text-xl hover:shadow-lg  transition-colors border-b">
    <td className="py-2 px-3">{orderId}</td>
    <td className="py-2 px-3">{customer}</td>
    <td className="py-2 px-3">{product}</td>
    <td className="py-2 px-3 text-center">{quantity}</td>
    <td className="py-2 px-3">{amount} €</td>
    <td className="py-2 px-3">{payment}</td>
    <td className={`py-2 px-3 font-semibold}`}>
      {paymentStatus}
    </td>
  </tr>
);
const Orders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [userNames, setUserNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/GetAllOrders");
        const data = await res.json();

        if (data.success) {
          setOrders(data.orders);
          const namesMap: Record<number, string> = {};
          await Promise.all(
            data.orders.map(async (order: Order) => {
              const userRes = await fetch(`http://localhost:4000/getUser/${order.userId}`);
              const userData: User = await userRes.json();
              namesMap[order.userId] = userData.fullname || `User ${order.userId}`;
            })
          );
          setUserNames(namesMap);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading orders...</div>;
  const aggregatedData: { [key: string]: { userId: number; product: string; quantity: number; totalPrice: number; payment: string; paymentStatus: string } } = {};

  orders.forEach(order => {
    order.cartItems.forEach(item => {
      const key = `${order.userId}-${item.productId}`;
      if (!aggregatedData[key]) {
        aggregatedData[key] = {
          userId: order.userId,
          product: item.name,
          quantity: item.quantity,
          totalPrice: item.price * item.quantity,
          payment: order.paymentMethod,
          paymentStatus: order.paymentStatus,
        };
      } else {
        aggregatedData[key].quantity += item.quantity;
        aggregatedData[key].totalPrice += item.price * item.quantity;
      }
    });
  });

  const tableRows = Object.values(aggregatedData);
  return (
    <div className="space-y-4">
      <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col">
        <h3 className="text-blue-800 font-semibold mb-2 text-2xl text-center">All Orders</h3>
        <hr className="w-16 h-1 rounded-full mx-auto border-none outline-none bg-blue-900 mb-4" />
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse text-left cursor-pointer">
            <thead className="bg-blue-800 text-white shadow-lg">
              <tr>
                {["Order ID","Customer","Product","Quantity","Amount (€)","Payment","Payment status"].map((t) => (
                  <th key={t} className="py-3 px-4 text-sm font-semibold  uppercase tracking-wider">{t}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {tableRows.map((row, idx) => (
                <TableRow
                  key={idx}
                  orderId={row.userId}
                  customer={userNames[row.userId] || `User ${row.userId}`}
                  product={row.product}
                  quantity={row.quantity}
                  amount={row.totalPrice}
                  payment={row.payment}
                  paymentStatus={row.paymentStatus === "paid" ? "Paid" : "Pending"}
                />
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Orders
