import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  Card,
  Space,
  Typography,
  Divider,
  Alert,
  message,
  Steps,
  Row,
  Col,
  Statistic,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  TeamOutlined,
  CreditCardOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { reservationsAPI } from "../lib/api";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Step } = Steps;
const { TextArea } = Input;

function BookingForm({ room, onSuccess, onCancel }) {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [reservationData, setReservationData] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const [razorpayKey, setRazorpayKey] = useState("");

  useEffect(() => {
    // Load Razorpay script
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    // Get Razorpay key from backend
    fetchRazorpayKey();

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const fetchRazorpayKey = async () => {
    try {
      const response = await fetch(
        "http://localhost:8082/api/payments/razorpay-key"
      );
      const data = await response.json();
      setRazorpayKey(data.key || "rzp_test_YOUR_KEY_ID");
    } catch (error) {
      console.error("Error fetching Razorpay key:", error);
    }
  };

  const calculateTotal = (dates) => {
    if (!dates || dates.length !== 2 || !room) return 0;

    const nights = dates[1].diff(dates[0], "days");
    return nights * parseFloat(room.basePrice);
  };

  const handleDatesChange = (dates) => {
    if (dates && dates.length === 2) {
      const total = calculateTotal(dates);
      setTotalAmount(total);
    }
  };

  const handleBookingSubmit = async (values) => {
    setLoading(true);
    try {
      const user = JSON.parse(localStorage.getItem("user_data"));
      if (!user) {
        message.error("Please login to book a room");
        return;
      }

      // Ensure userId exists (backward compatibility check)
      const userId = user.id || user.userId;
      if (!userId) {
        message.error("Invalid user session. Please logout and login again.");
        return;
      }

      const [checkIn, checkOut] = values.dates;

      // Create reservation
      const reservationResponse = await reservationsAPI.createReservation({
        userId: userId,
        roomId: room.id,
        checkIn: checkIn.format("YYYY-MM-DD"),
        checkOut: checkOut.format("YYYY-MM-DD"),
        guestCount: values.guests,
        guestName: values.guestName,
        guestEmail: values.guestEmail,
        guestPhone: values.guestPhone,
        specialRequests: values.specialRequests,
      });

      if (reservationResponse.success) {
        setReservationData(reservationResponse.reservation);
        setCurrentStep(1);
        message.success("Reservation created! Please complete payment.");
      }
    } catch (error) {
      message.error(error.message || "Failed to create reservation");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!reservationData) return;

    setLoading(true);
    try {
      // Create payment order
      const orderResponse = await fetch(
        "http://localhost:8082/api/payments/create-order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reservationId: reservationData.id,
            amount: totalAmount,
          }),
        }
      );

      if (!orderResponse.ok) {
        const errorPayload = await orderResponse.json().catch(() => ({}));
        throw new Error(
          errorPayload.message || "Failed to create payment order"
        );
      }

      const orderData = await orderResponse.json();

      // Initialize Razorpay
      const options = {
        key: razorpayKey,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "LuxeStay Hotel",
        description: `Booking for ${room.roomNumber}`,
        order_id: orderData.orderId,
        handler: async function (response) {
          // Verify payment
          try {
            const verifyResponse = await fetch(
              "http://localhost:8082/api/payments/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  paymentId: orderData.paymentId,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpayOrderId: response.razorpay_order_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              }
            );

            if (!verifyResponse.ok) {
              const errorPayload = await verifyResponse
                .json()
                .catch(() => ({}));
              throw new Error(
                errorPayload.message || "Payment verification failed"
              );
            }

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              setCurrentStep(2);
              message.success("Payment successful!");
              setTimeout(() => {
                onSuccess && onSuccess(reservationData);
              }, 2000);
            } else {
              message.error("Payment verification failed");
            }
          } catch (error) {
            console.error("Payment verification error", error);
            message.error(error.message || "Payment verification failed");
          }
        },
        prefill: {
          name: form.getFieldValue("guestName"),
          email: form.getFieldValue("guestEmail"),
          contact: form.getFieldValue("guestPhone"),
        },
        theme: {
          color: "#1890ff",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment initiation error", error);
      message.error(error.message || "Failed to initiate payment");
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    {
      title: "Booking Details",
      icon: <CalendarOutlined />,
    },
    {
      title: "Payment",
      icon: <CreditCardOutlined />,
    },
    {
      title: "Confirmation",
      icon: <CheckCircleOutlined />,
    },
  ];

  return (
    <Card>
      <Steps current={currentStep} style={{ marginBottom: 24 }}>
        {steps.map((item, index) => (
          <Step key={index} title={item.title} icon={item.icon} />
        ))}
      </Steps>

      {currentStep === 0 && (
        <>
          <Title level={4}>Complete Your Booking</Title>
          <Divider />

          <Row gutter={24}>
            <Col span={16}>
              <Form
                form={form}
                layout="vertical"
                onFinish={handleBookingSubmit}
                initialValues={{
                  guests: 1,
                }}
              >
                <Form.Item
                  name="dates"
                  label="Check-in & Check-out"
                  rules={[{ required: true, message: "Please select dates" }]}
                >
                  <RangePicker
                    style={{ width: "100%" }}
                    format="YYYY-MM-DD"
                    disabledDate={(current) =>
                      current && current < dayjs().startOf("day")
                    }
                    onChange={handleDatesChange}
                  />
                </Form.Item>

                <Form.Item
                  name="guests"
                  label="Number of Guests"
                  rules={[
                    {
                      required: true,
                      message: "Please enter number of guests",
                    },
                  ]}
                >
                  <InputNumber
                    min={1}
                    max={room?.capacity || 4}
                    style={{ width: "100%" }}
                    prefix={<TeamOutlined />}
                  />
                </Form.Item>

                <Form.Item
                  name="guestName"
                  label="Guest Name"
                  rules={[
                    { required: true, message: "Please enter guest name" },
                  ]}
                >
                  <Input prefix={<UserOutlined />} placeholder="Full Name" />
                </Form.Item>

                <Form.Item
                  name="guestEmail"
                  label="Email"
                  rules={[
                    { required: true, message: "Please enter email" },
                    { type: "email", message: "Please enter valid email" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="email@example.com"
                  />
                </Form.Item>

                <Form.Item
                  name="guestPhone"
                  label="Phone Number"
                  rules={[
                    { required: true, message: "Please enter phone number" },
                  ]}
                >
                  <Input
                    prefix={<UserOutlined />}
                    placeholder="+91 1234567890"
                  />
                </Form.Item>

                <Form.Item
                  name="specialRequests"
                  label="Special Requests (Optional)"
                >
                  <TextArea
                    rows={4}
                    placeholder="Any special requirements..."
                  />
                </Form.Item>

                <Space>
                  <Button onClick={onCancel}>Cancel</Button>
                  <Button type="primary" htmlType="submit" loading={loading}>
                    Continue to Payment
                  </Button>
                </Space>
              </Form>
            </Col>

            <Col span={8}>
              <Card title="Booking Summary">
                <Space direction="vertical" style={{ width: "100%" }}>
                  <Text strong>{room?.roomNumber}</Text>
                  <Text type="secondary">{room?.category} Room</Text>
                  <Divider />
                  <Statistic
                    title="Price per Night"
                    value={room?.basePrice}
                    prefix="₹"
                  />
                  {totalAmount > 0 && (
                    <>
                      <Divider />
                      <Statistic
                        title="Total Amount"
                        value={totalAmount}
                        prefix="₹"
                        valueStyle={{ color: "#3f8600" }}
                      />
                    </>
                  )}
                </Space>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {currentStep === 1 && (
        <>
          <Title level={4}>Complete Payment</Title>
          <Divider />

          <Alert
            message="Secure Payment"
            description="Your payment is secured by Razorpay. You will be redirected to Razorpay's secure payment gateway."
            type="info"
            showIcon
            style={{ marginBottom: 24 }}
          />

          <Card>
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Booking Reference"
                  value={reservationData?.confirmationNumber}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Total Amount"
                  value={totalAmount}
                  prefix="₹"
                />
              </Col>
            </Row>
            <Divider />
            <Space>
              <Button onClick={() => setCurrentStep(0)}>Back</Button>
              <Button
                type="primary"
                icon={<CreditCardOutlined />}
                onClick={handlePayment}
                loading={loading}
                size="large"
              >
                Pay ₹{totalAmount}
              </Button>
            </Space>
          </Card>
        </>
      )}

      {currentStep === 2 && (
        <>
          <div style={{ textAlign: "center", padding: "40px 0" }}>
            <CheckCircleOutlined style={{ fontSize: 72, color: "#52c41a" }} />
            <Title level={2}>Booking Confirmed!</Title>
            <Text type="secondary">
              Your confirmation number is:{" "}
              <strong>{reservationData?.confirmationNumber}</strong>
            </Text>
            <Divider />
            <Button
              type="primary"
              size="large"
              onClick={() => onSuccess && onSuccess(reservationData)}
            >
              View My Bookings
            </Button>
          </div>
        </>
      )}
    </Card>
  );
}

export default BookingForm;
