import React, { useEffect, useState } from 'react';
import { Table, Button, Select, Pagination } from 'antd';
import { getAllProducts } from '../api/productApi';
import { useNavigate } from 'react-router-dom';

const { Option } = Select;

const DBItems = () => {
  const [products, setProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(4);
  const [sortCategory, setSortCategory] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res);
      } catch (err) {
        console.log(err);
      }
    };
    fetchAllProducts();
  }, []);

  const handleSortCategory = (value) => {
    setSortCategory(value);
  };

  const sortedProducts = sortCategory
    ? [...products].sort(
        (a, b) =>
          a.category.localeCompare(b.category) *
          (sortCategory === 'asc' ? 1 : -1)
      )
    : products;

  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = sortedProducts.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <div style={{ padding: '24px' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <h1
          style={{ fontSize: '20px', fontWeight: 'bold', marginBottom: '16px' }}
        >
          Product Dashboard
        </h1>

        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <Select
            defaultValue=""
            onChange={handleSortCategory}
            style={{ width: '200px' }}
          >
            <Option value="">No Sort</Option>
            <Option value="asc">Sort by Category (ASC)</Option>
            <Option value="desc">Sort by Category (DESC)</Option>
          </Select>
        </div>
      </div>

      <div className="overflow-x-auto w-full">
        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                #
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                Item Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                Price (VND)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 border-r">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts.map((product, index) => (
              <tr
                key={product.id}
                className={
                  index % 2 === 0
                    ? 'bg-gray-100 dark:bg-gray-900'
                    : 'bg-white dark:bg-gray-800'
                }
              >
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                  {startIndex + index + 1}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                  {product.itemName}
                </td>
                <td className="px-6 py-4 capitalize whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                  {product.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                  {product.price.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700 border-r">
                  <img
                    src={product.imageDownloadUrl}
                    alt={product.itemName}
                    className="h-12 w-12 object-cover rounded-md"
                  />
                </td>
                <td className="flex items-center gap-4 px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 border-b border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() =>
                      navigate(`/admin/dashboard/items/products/${product.id}`)
                    }
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-300"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => console.log(`Edit product: ${product.id}`)}
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none focus:ring focus:ring-red-300"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="mt-4 flex justify-end">
        <Pagination
          current={currentPage}
          pageSize={itemsPerPage}
          total={products.length}
          onChange={(page) => setCurrentPage(page)}
        />
      </div>
    </div>
  );
};

export default DBItems;
