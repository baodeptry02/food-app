import React, { useEffect, useState } from 'react';
import { getAllOrders } from '../../api/orderApi';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Empty, Select, Pagination } from 'antd';

const { Option } = Select;

const Order = () => {
  const user = useSelector((state) => state?.userState?.user);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const data = await getAllOrders(user?.uid);
        setOrders(data);
        setFilteredOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
      } finally {
        setLoading(false);
      }
    };

    if (user?.uid) fetchOrders();
  }, [user]);

  const formatDate = (timestamp) => {
    const date = new Date(timestamp._seconds * 1000);
    const formattedDate = date.toLocaleDateString('en-GB');
    const formattedTime = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
    });
    return `${formattedDate}, ${formattedTime}`;
  };

  const handleStatusChange = (value) => {
    setStatusFilter(value);
    filterAndSortOrders(value, sortOrder);
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    filterAndSortOrders(statusFilter, value);
  };

  const filterAndSortOrders = (status, order) => {
    let filtered = [...orders];
    if (status) {
      filtered = filtered.filter((o) => o.status === status);
    }
    if (order === 'newest') {
      filtered.sort((a, b) => b.createdAt._seconds - a.createdAt._seconds);
    } else {
      filtered.sort((a, b) => a.createdAt._seconds - b.createdAt._seconds);
    }
    setFilteredOrders(filtered);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  if (loading) {
    return;
  }

  return (
    <div className="pt-12 h-full bg-primary dark:bg-darkBg transition-colors duration-500 ease-in-out">
      <div className="py-6 p-4 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Your Orders</h2>

        <div className="flex justify-between items-center mb-4">
          <Select
            value={statusFilter}
            onChange={handleStatusChange}
            placeholder="Filter by status"
            className="w-40"
          >
            <Option value="">All Status</Option>
            <Option value="PENDING">Pending</Option>
            <Option value="PAID">Paid</Option>
            <Option value="CANCELLED">Cancelled</Option>
          </Select>

          <Select
            value={sortOrder}
            onChange={handleSortChange}
            placeholder="Sort by"
            className="w-40"
          >
            <Option value="newest">Newest</Option>
            <Option value="oldest">Oldest</Option>
          </Select>
        </div>

        {filteredOrders.length === 0 ? (
          <div className="pt-4 h-full bg-white dark:bg-darkBg transition-colors duration-500 ease-in-out border border-gray-200 dark:border-gray-700 rounded-md">
            <h1 className="text-2xl font-bold mb-6 text-center text-primaryColor">
              No order history
            </h1>
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description="Your cart is empty"
            />
            <div className="text-center my-4">
              <button
                onClick={() => navigate('/menu')}
                className="px-6 py-2 bg-primaryColor text-white rounded-lg"
              >
                Go to Menu
              </button>
            </div>
          </div>
        ) : (
          <div>
            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                    Created At
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                    Total Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order, index) => (
                  <tr
                    key={order.orderId}
                    className={
                      index % 2 === 0
                        ? 'bg-gray-100 dark:bg-gray-900'
                        : 'bg-white dark:bg-gray-800'
                    }
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {(currentPage - 1) * pageSize + index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {order.orderId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                      {order.totalCartPrice.toLocaleString()} VND
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm border-b border-gray-200 dark:border-gray-700 border-r ${
                        order.status === 'PENDING'
                          ? 'text-yellow-500'
                          : order.status === 'PAID'
                            ? 'text-green-500'
                            : 'text-red-500'
                      }`}
                    >
                      {order.status}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                      <button
                        onClick={() =>
                          navigate(`/me/order-success/${order.orderId}`)
                        }
                        className="bg-blue-500 p-2 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-4 flex justify-end">
              <Pagination
                current={currentPage}
                pageSize={pageSize}
                total={filteredOrders.length}
                onChange={handlePageChange}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Order;
