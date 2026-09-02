import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PortalLayout from "../../components/PortalLayout/PortalLayout";
import { formatCurrency, generateOrderNumber } from "../../utils/formatters";
import { COMPANY_INFO } from "../../../config/siteConfig";

const OrdersPage = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("place-order");
  const [formData, setFormData] = useState({
    size: "Regular",
    quantity: "50",
    orderedByName: "",
    deliveryRecipientName: "",
    phone: "",
    address: {
      houseNumber: "",
      building: "",
      street: "",
      area: "",
      landmark: "",
      village: "",
      city: "",
      district: "",
      state: "",
      pinCode: "",
      country: "India",
    },
    couponCode: "",
  });

  const [orderSubmitted, setOrderSubmitted] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  const quantities = [
    { boxes: 50, pricePerBox: 500 },
    { boxes: 100, pricePerBox: 300 },
    { boxes: 150, pricePerBox: 250 },
  ];

  const selectedQty = quantities.find(
    (q) => q.boxes === parseInt(formData.quantity),
  );
  const subtotal = selectedQty
    ? selectedQty.boxes * selectedQty.pricePerBox
    : 0;
  const discount = formData.couponCode ? 100 : 0;
  const total = subtotal - discount;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      address: { ...prev.address, [name]: value },
    }));
  };

  const handlePlaceOrder = (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.orderedByName ||
      !formData.deliveryRecipientName ||
      !formData.phone
    ) {
      alert("Please fill in all required personal fields");
      return;
    }

    const requiredAddressFields = [
      "houseNumber",
      "street",
      "city",
      "state",
      "pinCode",
    ];
    if (!requiredAddressFields.every((field) => formData.address[field])) {
      alert("Please fill in all required address fields");
      return;
    }

    setOrderSubmitted(true);

    // Generate receipt
    const orderNumber = generateOrderNumber(Date.now());
    const receipt = {
      orderNumber,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      orderedBy: formData.orderedByName,
      deliveryTo: formData.deliveryRecipientName,
      phone: formData.phone,
      product: "Araina Sanitary Pads",
      size: formData.size,
      boxes: parseInt(formData.quantity),
      pricePerBox: selectedQty.pricePerBox,
      subtotal,
      discount,
      couponCode: formData.couponCode || "None",
      total,
      address: formData.address,
      status: "Confirmed",
      paymentMethod: "N/A (Coming Soon)",
    };

    setPlacedOrder(receipt);

    setTimeout(() => {
      setOrderSubmitted(false);
      setActiveTab("order-history");
    }, 1500);
  };

  const downloadReceipt = () => {
    if (!placedOrder) return;

    const receiptHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Invoice #${placedOrder.orderNumber}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { 
            font-family: 'Arial', sans-serif;
            background: #f5f5f5;
            padding: 20px;
          }
          .container {
            max-width: 800px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
          }
          
          /* Header Section */
          .header {
            border-bottom: 3px solid #EF5F7D;
            padding-bottom: 30px;
            margin-bottom: 30px;
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
          }
          
          .company-info {
            flex: 1;
          }
          
          .company-logo {
            font-size: 32px;
            font-weight: bold;
            color: #EF5F7D;
            margin-bottom: 5px;
            font-family: 'Arial Black', sans-serif;
          }
          
          .company-tagline {
            font-size: 12px;
            color: #6CADBA;
            font-weight: bold;
            letter-spacing: 2px;
            margin-bottom: 10px;
          }
          
          .company-details {
            font-size: 11px;
            color: #666;
            line-height: 1.6;
          }
          
          .company-details p {
            margin: 3px 0;
          }
          
          .invoice-header {
            text-align: right;
          }
          
          .invoice-title {
            font-size: 24px;
            font-weight: bold;
            color: #333;
            margin-bottom: 5px;
          }
          
          .invoice-number {
            font-size: 14px;
            color: #EF5F7D;
            font-weight: bold;
          }
          
          .invoice-date {
            font-size: 11px;
            color: #666;
            margin-top: 5px;
          }
          
          /* Two Column Layout */
          .content {
            display: flex;
            gap: 40px;
            margin-bottom: 30px;
          }
          
          .column {
            flex: 1;
          }
          
          .section-label {
            font-size: 11px;
            font-weight: bold;
            color: #EF5F7D;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin-bottom: 10px;
            border-bottom: 1px solid #EF5F7D;
            padding-bottom: 8px;
          }
          
          .info-row {
            font-size: 13px;
            color: #333;
            margin-bottom: 6px;
            line-height: 1.5;
          }
          
          .info-label {
            color: #666;
            font-weight: bold;
          }
          
          /* Order Items */
          .items-section {
            margin-bottom: 30px;
          }
          
          .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 15px;
          }
          
          .items-table th {
            background: #f5f5f5;
            border-bottom: 2px solid #EF5F7D;
            padding: 12px;
            text-align: left;
            font-size: 12px;
            font-weight: bold;
            color: #333;
            text-transform: uppercase;
          }
          
          .items-table td {
            padding: 12px;
            border-bottom: 1px solid #ddd;
            font-size: 13px;
            color: #333;
          }
          
          .items-table tr:last-child td {
            border-bottom: none;
          }
          
          .qty-col { text-align: center; }
          .price-col { text-align: right; }
          .total-col { text-align: right; font-weight: bold; }
          
          /* Summary Section */
          .summary-section {
            display: flex;
            justify-content: flex-end;
            margin-bottom: 30px;
          }
          
          .summary-box {
            width: 100%;
            max-width: 350px;
            background: #f9f9f9;
            border: 1px solid #EF5F7D;
            padding: 20px;
            border-radius: 4px;
          }
          
          .summary-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            font-size: 13px;
          }
          
          .summary-row .label {
            color: #666;
          }
          
          .summary-row .value {
            color: #333;
            font-weight: bold;
          }
          
          .summary-row.discount .value {
            color: #EF5F7D;
          }
          
          .summary-row.total {
            border-top: 2px solid #EF5F7D;
            padding-top: 12px;
            margin-top: 12px;
            font-size: 16px;
          }
          
          .summary-row.total .value {
            color: #EF5F7D;
            font-weight: bold;
            font-size: 18px;
          }
          
          /* Payment Method */
          .payment-section {
            background: #EF5F7D;
            color: white;
            padding: 15px;
            border-radius: 4px;
            margin-bottom: 30px;
            text-align: center;
          }
          
          .payment-section .label {
            font-size: 11px;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
            margin-bottom: 5px;
          }
          
          .payment-section .method {
            font-size: 16px;
            font-weight: bold;
          }
          
          /* Footer */
          .footer {
            border-top: 1px solid #ddd;
            padding-top: 20px;
            text-align: center;
            font-size: 11px;
            color: #666;
            line-height: 1.8;
          }
          
          .footer-note {
            background: #f5f5f5;
            padding: 15px;
            border-left: 3px solid #EF5F7D;
            margin-bottom: 15px;
            font-size: 12px;
            color: #333;
          }
          
          /* Print Styles */
          @media print {
            body { background: white; padding: 0; }
            .container { box-shadow: none; padding: 0; }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <!-- Header -->
          <div class="header">
            <div class="company-info">
              <div class="company-logo">${COMPANY_INFO.brand}</div>
              <div class="company-tagline">${COMPANY_INFO.tagline}</div>
              <div class="company-details">
                <p><strong>${COMPANY_INFO.name}</strong></p>
                <p>${COMPANY_INFO.address}</p>
                <p>📞 ${COMPANY_INFO.phone} | 📧 ${COMPANY_INFO.email}</p>
                <p>🕐 ${COMPANY_INFO.businessHours}</p>
              </div>
            </div>
            <div class="invoice-header">
              <div class="invoice-title">INVOICE</div>
              <div class="invoice-number">#${placedOrder.orderNumber}</div>
              <div class="invoice-date">${placedOrder.date} ${placedOrder.time}</div>
            </div>
          </div>

          <!-- Customer Info -->
          <div class="content">
            <div class="column">
              <div class="section-label">Order Placed By</div>
              <div class="info-row"><span class="info-label">Name:</span> ${placedOrder.orderedBy}</div>
            </div>
            <div class="column">
              <div class="section-label">Delivery To</div>
              <div class="info-row"><span class="info-label">Name:</span> ${placedOrder.deliveryTo}</div>
              <div class="info-row"><span class="info-label">Phone:</span> ${placedOrder.phone}</div>
              <div class="info-row"><span class="info-label">Address:</span></div>
              <div class="info-row" style="margin-left: 0; font-size: 12px; color: #555;">
                ${placedOrder.address.houseNumber}${placedOrder.address.building ? ", " + placedOrder.address.building : ""}, 
                ${placedOrder.address.street}${placedOrder.address.area ? ", " + placedOrder.address.area : ""}<br>
                ${placedOrder.address.city}, ${placedOrder.address.state} ${placedOrder.address.pinCode}<br>
                ${placedOrder.address.country}
              </div>
            </div>
          </div>

          <!-- Order Items -->
          <div class="items-section">
            <div class="section-label">Order Items</div>
            <table class="items-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Size</th>
                  <th class="qty-col">Qty</th>
                  <th class="price-col">Price/Box</th>
                  <th class="total-col">Total</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${placedOrder.product}</td>
                  <td>${placedOrder.size}</td>
                  <td class="qty-col">${placedOrder.boxes}</td>
                  <td class="price-col">₹${placedOrder.pricePerBox}</td>
                  <td class="total-col">₹${placedOrder.subtotal}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Summary -->
          <div class="summary-section">
            <div class="summary-box">
              <div class="summary-row">
                <span class="label">Subtotal:</span>
                <span class="value">₹${placedOrder.subtotal}</span>
              </div>
              ${
                placedOrder.discount > 0
                  ? `
              <div class="summary-row discount">
                <span class="label">Discount (${placedOrder.couponCode}):</span>
                <span class="value">-₹${placedOrder.discount}</span>
              </div>
              `
                  : ""
              }
              <div class="summary-row total">
                <span class="label">TOTAL AMOUNT:</span>
                <span class="value">₹${placedOrder.total}</span>
              </div>
            </div>
          </div>

          <!-- Payment Method -->
          <div class="payment-section">
            <div class="label">Payment Method</div>
            <div class="method">💳 ${placedOrder.paymentMethod}</div>
          </div>

          <!-- Footer -->
          <div class="footer">
            <div class="footer-note">
              ✓ Order Status: <strong>${placedOrder.status}</strong><br>
              Thank you for your purchase! Track your order at www.arainas.com
            </div>
            <p>For any inquiries, contact us at ${COMPANY_INFO.email}</p>
            <p style="margin-top: 15px; color: #999;">This is an automatically generated invoice. Please keep it for your records.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const printWindow = window.open("", "", "height=800,width=900");
    printWindow.document.write(receiptHTML);
    printWindow.document.close();
    printWindow.print();
  };

  return (
    <PortalLayout showHeader={true} isAuthenticated={true}>
      <div className="max-w-4xl">
        <h1 className="text-3xl font-bold text-araina-black mb-2 tracking-tight">
          Orders
        </h1>
        <p className="text-araina-black/60 mb-8">
          Place a new order or view your order history
        </p>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-araina-pink/10">
          <button
            onClick={() => setActiveTab("place-order")}
            className={`py-3 px-1 font-semibold uppercase text-sm tracking-widest transition-all ${
              activeTab === "place-order"
                ? "border-b-2 border-araina-pink text-araina-pink"
                : "text-araina-black/60 hover:text-araina-black"
            }`}
          >
            Place New Order
          </button>
          <button
            onClick={() => setActiveTab("order-history")}
            className={`py-3 px-1 font-semibold uppercase text-sm tracking-widest transition-all ${
              activeTab === "order-history"
                ? "border-b-2 border-araina-pink text-araina-pink"
                : "text-araina-black/60 hover:text-araina-black"
            }`}
          >
            Order History
          </button>
        </div>

        {/* Place New Order Tab */}
        {activeTab === "place-order" && (
          <div className="bg-araina-white border border-araina-pink/10 rounded-lg p-8">
            <form onSubmit={handlePlaceOrder}>
              {/* Product Selection */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-araina-black mb-4 uppercase tracking-widest">
                  Product
                </label>
                <div className="p-4 border border-araina-black/10 rounded-lg bg-araina-black/5">
                  <p className="font-semibold text-araina-black">
                    Araina Sanitary Pads
                  </p>
                  <p className="text-sm text-araina-black/60">
                    Premium quality sanitary pads
                  </p>
                </div>
              </div>

              {/* Size Selection */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-araina-black mb-4 uppercase tracking-widest">
                  Size / Variant
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                >
                  <option value="Regular">Regular</option>
                  <option value="Night">Night</option>
                  <option value="Heavy">Heavy</option>
                </select>
              </div>

              {/* Quantity Selection */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-araina-black mb-4 uppercase tracking-widest">
                  Quantity (Boxes)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {quantities.map((qty) => (
                    <button
                      key={qty.boxes}
                      type="button"
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          quantity: qty.boxes.toString(),
                        }))
                      }
                      className={`p-4 rounded-lg border-2 transition-all text-center ${
                        formData.quantity === qty.boxes.toString()
                          ? "border-araina-pink bg-araina-pink/5"
                          : "border-araina-pink/20 hover:border-araina-pink/40"
                      }`}
                    >
                      <p className="font-bold text-araina-black text-lg">
                        {qty.boxes}
                      </p>
                      <p className="text-araina-pink text-sm font-semibold">
                        {formatCurrency(qty.pricePerBox)}/box
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Ordered By Section */}
              <div className="mb-8 pb-8 border-b border-araina-pink/10">
                <h3 className="text-sm font-bold text-araina-black mb-4 uppercase tracking-widest">
                  Ordered By (Your Info)
                </h3>
                <input
                  type="text"
                  name="orderedByName"
                  placeholder="Your Full Name *"
                  value={formData.orderedByName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                />
              </div>

              {/* Delivery Recipient Section */}
              <div className="mb-8 pb-8 border-b border-araina-pink/10">
                <h3 className="text-sm font-bold text-araina-black mb-4 uppercase tracking-widest">
                  Delivery Recipient
                </h3>
                <div className="space-y-4">
                  <input
                    type="text"
                    name="deliveryRecipientName"
                    placeholder="Recipient Full Name *"
                    value={formData.deliveryRecipientName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone Number *"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                </div>
              </div>

              {/* Delivery Address Section */}
              <div className="mb-8 pb-8 border-b border-araina-pink/10">
                <h3 className="text-sm font-bold text-araina-black mb-4 uppercase tracking-widest">
                  Delivery Address
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="houseNumber"
                    placeholder="House Number *"
                    value={formData.address.houseNumber}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="building"
                    placeholder="Building (Optional)"
                    value={formData.address.building}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street *"
                    value={formData.address.street}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="area"
                    placeholder="Area (Optional)"
                    value={formData.address.area}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="landmark"
                    placeholder="Landmark (Optional)"
                    value={formData.address.landmark}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="village"
                    placeholder="Village (Optional)"
                    value={formData.address.village}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City *"
                    value={formData.address.city}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="district"
                    placeholder="District (Optional)"
                    value={formData.address.district}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="state"
                    placeholder="State *"
                    value={formData.address.state}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                  <input
                    type="text"
                    name="pinCode"
                    placeholder="PIN Code *"
                    value={formData.address.pinCode}
                    onChange={handleAddressChange}
                    className="px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                  />
                </div>
              </div>

              {/* Coupon Code */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-araina-black mb-4 uppercase tracking-widest">
                  Coupon Code (Optional)
                </label>
                <input
                  type="text"
                  name="couponCode"
                  placeholder="Enter coupon code"
                  value={formData.couponCode}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-araina-black/10 rounded-lg focus:outline-none focus:border-araina-pink"
                />
              </div>

              {/* Order Summary */}
              <div className="bg-araina-pink/5 rounded-lg p-6 mb-8">
                <h3 className="font-bold text-araina-black mb-4 uppercase tracking-widest">
                  Order Summary
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-araina-black/70">
                      Subtotal ({parseInt(formData.quantity)} boxes @{" "}
                      {formatCurrency(selectedQty?.pricePerBox || 0)}):
                    </span>
                    <span className="font-semibold text-araina-black">
                      {formatCurrency(subtotal)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-araina-pink">
                      <span>Discount ({formData.couponCode}):</span>
                      <span>-{formatCurrency(discount)}</span>
                    </div>
                  )}
                  <div className="border-t border-araina-pink/20 pt-3 flex justify-between">
                    <span className="font-bold text-araina-black">Total:</span>
                    <span className="font-bold text-2xl text-araina-pink">
                      {formatCurrency(total)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={orderSubmitted}
                className="w-full bg-araina-pink hover:bg-araina-pink/90 disabled:bg-araina-pink/50 text-araina-white font-bold uppercase tracking-widest py-4 rounded-lg transition-all"
              >
                {orderSubmitted ? "Processing Order..." : "Place Order"}
              </button>
            </form>
          </div>
        )}

        {/* Order History Tab */}
        {activeTab === "order-history" && (
          <div className="bg-araina-white border border-araina-pink/10 rounded-lg p-8">
            {placedOrder ? (
              <div>
                <div className="text-center mb-8">
                  <div className="w-16 h-16 rounded-full bg-araina-pink/10 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">✓</span>
                  </div>
                  <h2 className="text-2xl font-bold text-araina-black mb-2">
                    Order Confirmed!
                  </h2>
                  <p className="text-araina-black/60">
                    Order #{placedOrder.orderNumber}
                  </p>
                </div>

                {/* Receipt Preview */}
                <div className="bg-araina-white border border-araina-black/10 rounded-lg p-8 mb-8">
                  {/* Company Header */}
                  <div className="border-b-2 border-araina-pink pb-6 mb-6">
                    <div className="grid grid-cols-2 gap-8">
                      <div>
                        <p className="text-3xl font-bold text-araina-pink mb-2">
                          {COMPANY_INFO.brand}
                        </p>
                        <p className="text-xs font-bold text-araina-blue mb-3 tracking-widest">
                          {COMPANY_INFO.tagline}
                        </p>
                        <div className="text-xs text-araina-black/70 space-y-1">
                          <p className="font-semibold text-araina-black">
                            {COMPANY_INFO.name}
                          </p>
                          <p>{COMPANY_INFO.address}</p>
                          <p>📞 {COMPANY_INFO.phone}</p>
                          <p>📧 {COMPANY_INFO.email}</p>
                          <p>🕐 {COMPANY_INFO.businessHours}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-araina-black mb-2">
                          INVOICE
                        </p>
                        <p className="text-lg font-bold text-araina-pink mb-2">
                          #{placedOrder.orderNumber}
                        </p>
                        <p className="text-xs text-araina-black/60">
                          {placedOrder.date}
                        </p>
                        <p className="text-xs text-araina-black/60">
                          {placedOrder.time}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Customer Information */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div>
                      <p className="text-xs font-bold text-araina-pink mb-3 uppercase tracking-widest border-b border-araina-pink pb-2">
                        Order Placed By
                      </p>
                      <p className="text-sm font-semibold text-araina-black">
                        {placedOrder.orderedBy}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-araina-pink mb-3 uppercase tracking-widest border-b border-araina-pink pb-2">
                        Delivery To
                      </p>
                      <p className="text-sm font-semibold text-araina-black mb-1">
                        {placedOrder.deliveryTo}
                      </p>
                      <p className="text-xs text-araina-black/70 mb-2">
                        {placedOrder.phone}
                      </p>
                      <p className="text-xs text-araina-black/70 leading-relaxed">
                        {placedOrder.address.houseNumber}
                        {placedOrder.address.building &&
                          `, ${placedOrder.address.building}`}
                        ,{placedOrder.address.street}
                        <br />
                        {placedOrder.address.city}, {placedOrder.address.state}{" "}
                        {placedOrder.address.pinCode}
                        <br />
                        {placedOrder.address.country}
                      </p>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="mb-8">
                    <p className="text-xs font-bold text-araina-pink mb-4 uppercase tracking-widest border-b border-araina-pink pb-2">
                      Order Items
                    </p>
                    <div className="space-y-3">
                      <div className="bg-araina-black/5 p-4 rounded-lg">
                        <div className="grid grid-cols-5 gap-4 text-xs font-bold text-araina-black/70 mb-3 uppercase">
                          <span className="col-span-2">Product</span>
                          <span className="text-center">Qty</span>
                          <span className="text-right">Price</span>
                          <span className="text-right">Total</span>
                        </div>
                        <div className="grid grid-cols-5 gap-4 text-sm text-araina-black border-t border-araina-pink/20 pt-3">
                          <span className="col-span-2">
                            <p className="font-semibold">
                              {placedOrder.product}
                            </p>
                            <p className="text-xs text-araina-black/60">
                              {placedOrder.size}
                            </p>
                          </span>
                          <span className="text-center font-semibold">
                            {placedOrder.boxes}
                          </span>
                          <span className="text-right">
                            {formatCurrency(placedOrder.pricePerBox)}
                          </span>
                          <span className="text-right font-semibold">
                            {formatCurrency(placedOrder.subtotal)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Summary & Payment */}
                  <div className="grid grid-cols-2 gap-8 mb-8">
                    <div></div>
                    <div>
                      <div className="bg-araina-pink/5 border border-araina-pink/20 rounded-lg p-6 mb-4">
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-araina-black/70">
                              Subtotal:
                            </span>
                            <span className="font-semibold text-araina-black">
                              {formatCurrency(placedOrder.subtotal)}
                            </span>
                          </div>
                          {placedOrder.discount > 0 && (
                            <div className="flex justify-between text-sm text-araina-pink">
                              <span>Discount ({placedOrder.couponCode}):</span>
                              <span className="font-semibold">
                                -{formatCurrency(placedOrder.discount)}
                              </span>
                            </div>
                          )}
                          <div className="border-t border-araina-pink/20 pt-3 flex justify-between">
                            <span className="font-bold text-araina-black">
                              Total:
                            </span>
                            <span className="font-bold text-xl text-araina-pink">
                              {formatCurrency(placedOrder.total)}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Payment Method */}
                      <div className="bg-araina-pink text-araina-white rounded-lg p-4 text-center">
                        <p className="text-xs font-bold mb-2 tracking-widest">
                          PAYMENT METHOD
                        </p>
                        <p className="text-sm font-bold">
                          {placedOrder.paymentMethod}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Footer Note */}
                  <div className="bg-araina-black/5 border-l-4 border-araina-pink p-4 text-xs text-araina-black/70">
                    <p className="mb-2">
                      <span className="font-bold">✓ Order Status:</span>{" "}
                      <span className="text-araina-pink font-semibold">
                        {placedOrder.status}
                      </span>
                    </p>
                    <p className="text-araina-black/60">
                      Thank you for your purchase! Track your order at{" "}
                      <span className="font-semibold">www.arainas.com</span>
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={downloadReceipt}
                    className="bg-araina-blue hover:bg-araina-blue/90 text-araina-white font-bold uppercase tracking-widest py-3 rounded-lg transition-all"
                  >
                    Download Receipt
                  </button>
                  <button
                    onClick={() => {
                      setActiveTab("place-order");
                      setPlacedOrder(null);
                      setFormData({
                        size: "Regular",
                        quantity: "50",
                        orderedByName: "",
                        deliveryRecipientName: "",
                        phone: "",
                        address: {
                          houseNumber: "",
                          building: "",
                          street: "",
                          area: "",
                          landmark: "",
                          village: "",
                          city: "",
                          district: "",
                          state: "",
                          pinCode: "",
                          country: "India",
                        },
                        couponCode: "",
                      });
                    }}
                    className="border-2 border-araina-pink text-araina-pink hover:bg-araina-pink hover:text-araina-white font-bold uppercase tracking-widest py-3 rounded-lg transition-all"
                  >
                    Place Another Order
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <p className="text-araina-black/60 mb-6">
                  No orders yet. Start by placing your first order!
                </p>
                <button
                  onClick={() => setActiveTab("place-order")}
                  className="bg-araina-pink hover:bg-araina-pink/90 text-araina-white font-bold uppercase tracking-widest py-3 px-6 rounded-lg transition-all"
                >
                  Place New Order
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </PortalLayout>
  );
};

export default OrdersPage;
