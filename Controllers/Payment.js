const axios = require("axios");
const config = require("../config/config").adminProps;
 
const apiKey = require("../config/config").nowPay;
//https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=Example
const HedaersConfig = {
  headers: {
    "x-api-key": apiKey,
    "Content-Type": "application/json",
  },
};
const paymentStats = {
  confirmed: "confirmed",
  finished: "finished",
  waiting: "waiting",
  partially_paid: "partially_paid",
  failed: "failed",
  expired: "expired",
  confirming: "confirming",
  sending: "sending",
  refunded: "refunded",
};

module.exports = {
  serverStatus: async () => {
    try {
      const response = await axios.get(`https://api.nowpayments.io/v1/status`);
      return response.data.message;
    } catch (error) {
      console.log(error.message);
    }
  },
  createPayment: async (order_id, price, pay_currency, description) => {
    try {
      const payload = {
        price_amount: price,
        price_currency: "usd",
        pay_currency: pay_currency,
        order_description: description,
        order_id: order_id,
        is_fee_paid_by_user: true,
        is_fixed_rate: true,
      };
      const response = {
        payment_id: "5899568644",
        payment_status: "waiting",
        pay_address: "3QWMNNK1FEfrWw9UKf7fp2tuM62h32KdDH",
        price_amount: 20,
        price_currency: "usd",
        pay_amount: 24.774008,
        amount_received: 24.774008,
        pay_currency: "usdt",
        order_id: "Normal VIP",
        order_description: "Normal channel",
        ipn_callback_url: null,
        created_at: "2023-07-21T08:40:22.462Z",
        updated_at: "2023-07-21T08:40:22.462Z",
        purchase_id: "4415362916",
        smart_contract: null,
        network: "btc",
        network_precision: null,
        time_limit: "2023-07-21T09:00:22.147Z",
        burning_percent: null,
        expiration_estimate_date: "2023-07-21T09:00:22.147Z",
        is_fixed_rate: true,
        is_fee_paid_by_user: true,
        valid_until: "2023-07-21T09:00:22.147Z",
        type: "crypto2crypto",
      };

      response.qrCode = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${response.pay_address}`;
      //await axios.post("https://api.nowpayments.io/v1/payment",payload,HedaersConfig );
      return response;
    } catch (error) {
      console.error("Error creating payment:", error.message);
    }
  },
  paymentStatus: async (payment_id) => {
    try {
      const response = await axios.get(
        `https://api.nowpayments.io/v1/payment/${payment_id}`,
        HedaersConfig
      );
      return response.data;
    } catch (error) {
      return "paiment error please contact " + config.SupportName;
      console.log(error.message);
    }
  },
  checkPayment:  (status) => {
    const paimentDone =
      status === paymentStats.confirmed || status === paymentStats.finished;
    const proccesing =
      status === paymentStats.confirming || status === paymentStats.sending;
    const failed = paymentStats.failed || paymentStats.expired;

    if (paimentDone) {
      return "OK";
    } else if (proccesing) {
      return "PROCCESING";
    } else if (status === paymentStats.waiting) {
      return "WAITING";
    } else if (status === paymentStats.partially_paid) {
      return "PARTIAL";
    } else if (failed) {
      return "OK";
    }
  },
};
