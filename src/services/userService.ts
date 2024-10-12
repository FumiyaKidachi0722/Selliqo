export async function fetchUserOrders() {
  // ダミーデータを返す非同期処理
  return Promise.resolve([
    { id: 1, status: 'Shipped' },
    { id: 2, status: 'Delivered' },
  ]);
}
