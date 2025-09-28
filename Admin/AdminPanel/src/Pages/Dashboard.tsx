import { useEffect, useState } from "react";
import PaymentChart from "../Component/PaymentChart";
import OrdersChart from "../Component/TotalOrdersChart";
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

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [totalOrders, setTotalOrders] = useState<Record<string, number>>({});
  const [paymentSummary, setPaymentSummary] = useState<Record<string, number>>({});
  const [userNames, setUserNames] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await fetch("http://localhost:4000/getLimitOrders");
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
  // total orders
    const fetchTotalOrders = async () => {
    if (!startDate || !endDate) return;

    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:4000/MostOrderedSeafood?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();
      if (data.success) {
        type MostOrderedItem = { name: string; count: number };
        const totalOrdersObj = data.mostOrdered.reduce((acc: Record<string, number>, item: MostOrderedItem) => {
          acc[item.name] = item.count;
          return acc;
        }, {});
        setTotalOrders(totalOrdersObj);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  // get stripe data
    useEffect(() => {
    const fetchStripeData = async () => {
      try {
        const res = await fetch("http://localhost:4000/paymentDetails");
        const data = await res.json();

        if (data.success) {
          setPaymentSummary(data.summary);
          console.log(data.summary);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStripeData();
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
  function NavigateToPath(): void {
    window.location.pathname="/Orders"
  }

  return (
    <div className="space-y-4">
      {/* Date Filter */}
      <div className="flex gap-2 items-center mb-4">
        <label className="lg:text-lg md:text-base sm:text-sm  font-semibold text-blue-800 px-3 ">Start Date:</label>
        <input className="border-2 px-5 py-3 border-blue-800 text-blue-800 font-medium" type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
        <label className="lg:text-lg md:text-base sm:text-sm  font-semibold text-blue-800 px-3 ">End Date:</label>
        <input  className="border-2 px-5 py-3 border-blue-800 text-blue-800 font-medium" type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
        <button onClick={fetchTotalOrders} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-800 text-white rounded-sm hover:bg-gradient-to-r hover:from-blue-800 hover:to-blue-500 cursor-pointer transition-all duration-200 ease-in">Filter</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center h-64">
          <OrdersChart totalOrders={totalOrders} />
        </div>
        <div className="bg-white p-4 rounded-xl shadow flex items-center justify-center h-64">
          <PaymentChart paymentSummary={paymentSummary} />
        </div>
      </div>

      <div className="bg-white p-5 rounded-xl shadow-sm flex flex-col">
        <h3 className="text-blue-800 font-semibold mb-2 text-2xl text-center">Recent Orders</h3>
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
          <button className="bg-gradient-to-r from-cyan-700 to-blue-800 text-white px-8 py-3 mt-5 border-none outline-none cursor-pointer text-lg font-semibold rounded-lg hover:bg-gradient-to-r hover:from-blue-700 hover:to-cyan-800 text-shadow-2xs shadow-md" onClick={()=> NavigateToPath()}>View All</button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
