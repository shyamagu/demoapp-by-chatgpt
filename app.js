const express = require('express');
const bodyParser = require('body-parser'); // 追加
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true })); // 追
app.use(bodyParser.json()); // 追加

// 注文テーブルの初期化
let orders = [];

// メニューテーブルの初期化
let menus = [
  { menu_id: 1, menu_name: 'ハンバーグ', price: 1000, category: 'メインディッシュ', description: 'ジューシーなハンバーグです' },
  { menu_id: 2, menu_name: 'カルボナーラ', price: 1200, category: 'パスタ', description: '濃厚なカルボナーラです' },
  { menu_id: 3, menu_name: 'ビール', price: 500, category: '飲み物', description: '爽やかなビールです' },
  { menu_id: 4, menu_name: 'サラダ', price: 800, category: '前菜', description: '野菜たっぷりのサラダです' },
  { menu_id: 5, menu_name: 'チーズケーキ', price: 600, category: 'デザート', description: '濃厚なチーズケーキです' },
];

app.get('/style.css', (req, res) => {
  res.sendFile(__dirname + '/style.css');
});

// ルートアクセス時にindex.htmlを返す
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// 注文の受け付け
app.post('/orders', (req, res) => {
  const { menu_id, quantity, note } = req.body;
  const menu = menus.find((menu) => menu.menu_id === menu_id);
  if (!menu) {
    res.status(400).send('Invalid menu_id');
    return;
  }
  const order = {
    order_id: orders.length + 1,
    menu_id,
    quantity,
    price: menu.price,
    note,
    status: '注文受付',
  };
  orders.push(order);
  res.send(order);
});

// 注文の確認
app.get('/orders', (req, res) => {
  res.send(orders);
});

// キャンセル
app.put('/orders/:order_id/cancel', (req, res) => {
  const order_id = parseInt(req.params.order_id);
  const order = orders.find((order) => order.order_id === order_id);
  if (!order) {
    res.status(400).send('Invalid order_id');
    return;
  }
  if (order.status === '注文受付' || order.status === '調理中') {
    order.status = 'キャンセル済み';
    res.send(order);
  } else {
    res.status(400).send('Cannot cancel the order');
  }
});

// 料理の調理
app.put('/orders/:order_id/cook', (req, res) => {
  console.log(req.params.order_id)

  const order_id = parseInt(req.params.order_id);
  const order = orders.find((order) => order.order_id === order_id);
  if (!order) {
    res.status(400).send('Invalid order_id');
    return;
  }
  if (order.status === '注文受付') {
    order.status = '調理中';
    res.send(order);
  } else {
    res.status(400).send('Cannot cook the order');
  }
});

// 注文の配膳
app.put('/orders/:order_id/serve', (req, res) => {
  const order_id = parseInt(req.params.order_id);
  const order = orders.find((order) => order.order_id === order_id);
  if (!order) {
    res.status(400).send('Invalid order_id');
    return;
  }
  if (order.status === '調理済み') {
    order.status = '配膳済み';
    res.send(order);
  } else {
    res.status(400).send('Cannot serve the order');
  }
});

// 会計
app.put('/orders/:order_id/pay', (req, res) => {
  const order_id = parseInt(req.params.order_id);
  const order = orders.find((order) => order.order_id === order_id);
  if (!order) {
    res.status(400).send('Invalid order_id');
    return;
  }
  if (order.status === '配膳済み') {
    order.status = '会計済み';
    const total_price = order.price * order.quantity;
    res.send({ order, total_price });
  } else {
    res.status(400).send('Cannot pay the order');
  }
});

// メニューの取得
app.get('/menus', (req, res) => {
    res.send(menus);
  });

// 追加
app.put('/orders/:order_id', (req, res) => {
  const order_id = parseInt(req.params.order_id);
  const order = orders.find((order) => order.order_id === order_id);
  if (!order) {
    res.status(400).send('Invalid order_id');
    return;
  }
  order.status = req.body.status;
  res.send(order);
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});

module.exports = app;