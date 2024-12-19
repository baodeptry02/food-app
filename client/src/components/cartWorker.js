const baseURL = 'http://localhost:5001/lms-backend-1d9f5/us-central1/app';

const taskQueue = [];
let isProcessing = false;

self.onmessage = async (event) => {
  const { type, payload } = event.data;

  if (type === 'updateQuantity') {
    taskQueue.push(payload);
    processQueue();
  } else if (type === 'decreaseQuantity') {
    taskQueue.push(payload);
    processQueue();
  }
};

async function processQueue() {
  if (isProcessing || taskQueue.length === 0) {
    return;
  }

  isProcessing = true;
  const payload = taskQueue.shift();

  try {
    const { id, action, cart, userId } = payload;
    const cartItem = cart.find((item) => item.id === id);
    if (!cartItem) {
      self.postMessage({ type: 'error', message: 'Item not found in cart' });
      return;
    }
    const newQuantity = action === 'increment' ? 1 : -1;
    self.postMessage({
      type: 'success',
      data: { ...cartItem, quantity: newQuantity },
    });

    // Send API request
    const response = await fetch(`${baseURL}/api/cart/${userId}/${id}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action }),
    });

    const result = await response.json();
    self.postMessage({ type: 'apiResponse', data: result });
  } catch (error) {
    self.postMessage({ type: 'error', message: error.message });
  } finally {
    isProcessing = false;
    processQueue();
  }
}
