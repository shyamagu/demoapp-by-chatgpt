const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../app'); // テスト対象のアプリケーション
const expect = chai.expect;

chai.use(chaiHttp);

describe('Express App', () => {
  // 注文の受け付け
  describe('POST /orders', () => {
    it('should create a new order', (done) => {
      chai.request(app)
        .post('/orders')
        .send({
          menu_id: 1,
          quantity: 2,
          note: 'no onion'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body).to.have.property('order_id');
          expect(res.body).to.have.property('menu_id');
          expect(res.body).to.have.property('quantity');
          expect(res.body).to.have.property('price');
          expect(res.body).to.have.property('note');
          expect(res.body).to.have.property('status');
          done();
        });
    });
  });

  // 注文の確認
  describe('GET /orders', () => {
    it('should get all orders', (done) => {
      chai.request(app)
        .get('/orders')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  // 注文のキャンセル
  describe('PUT /orders/:order_id/cancel', () => {
    it('should cancel the order', (done) => {
      chai.request(app)
        .put('/orders/1/cancel')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('キャンセル済み');
          done();
        });
    });
  });

  // 料理の調理
  describe('PUT /orders/:order_id/cook', () => {
    it('should cook the order', (done) => {
      chai.request(app)
        .put('/orders/2/cook')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('調理中');
          done();
        });
    });
  });

  // 注文の配膳
  describe('PUT /orders/:order_id/serve', () => {
    it('should serve the order', (done) => {
      chai.request(app)
        .put('/orders/2/serve')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('配膳済み');
          done();
        });
    });
  });

  // 会計
  describe('PUT /orders/:order_id/pay', () => {
    it('should pay the order', (done) => {
      chai.request(app)
        .put('/orders/2/pay')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.order.status).to.equal('会計済み');
          expect(res.body).to.have.property('total_price');
          done();
        });
    });
  });

  // メニューの取得
  describe('GET /menus', () => {
    it('should get all menus', (done) => {
      chai.request(app)
        .get('/menus')
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('array');
          done();
        });
    });
  });

  // 注文のステータス更新
  describe('PUT /orders/:order_id', () => {
    it('should update the order status', (done) => {
      chai.request(app)
        .put('/orders/2')
        .send({
          status: '調理済み'
        })
        .end((err, res) => {
          expect(res).to.have.status(200);
          expect(res.body).to.be.an('object');
          expect(res.body.status).to.equal('調理済み');
          done();
        });
    });
  });
});