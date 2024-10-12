export async function fetchAllOrders() {
  // ダミーデータを返す非同期処理
  return Promise.resolve([
    { id: 1, status: 'Shipped' },
    { id: 2, status: 'Pending' },
    { id: 3, status: 'Cancelled' },
  ]);
}
