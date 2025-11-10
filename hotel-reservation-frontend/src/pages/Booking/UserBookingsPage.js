import React, { useState, useEffect } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Tag,
  Typography,
  Row,
  Col,
  Statistic,
  Modal,
  message,
  Tabs,
  Descriptions,
  Divider,
  Rate,
  Alert,
  Spin,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  DollarOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  DownloadOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import styled from "styled-components";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import { reservationsAPI } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";
import { useResponsive } from "../../utils/responsive";
import { lightTheme, darkTheme } from "../../styles/theme";
import { useUIStore } from "../../store";

const { Title, Text } = Typography;
const { TabPane } = Tabs;
const { confirm } = Modal;

// Styled Components
const BookingsContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => (props.isMobile ? "16px" : "24px")};
`;

const StatsCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  .ant-statistic-title {
    color: ${(props) =>
      props.theme === "dark" ? darkTheme.text : lightTheme.text};
  }
  .ant-statistic-content {
    color: ${(props) =>
      props.theme === "dark" ? darkTheme.primary : lightTheme.primary};
  }
`;

const BookingCard = styled(Card)`
  margin-bottom: 16px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid
    ${(props) =>
      props.theme === "dark" ? darkTheme.border : lightTheme.border};

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  }
`;

const StatusTag = styled(Tag)`
  border-radius: 16px;
  padding: 4px 12px;
  font-weight: 500;
`;

const UserBookingsPage = () => {
  const { user } = useAuth();
  const { isMobile } = useResponsive();
  const { isDark } = useUIStore();
  const theme = isDark ? darkTheme : lightTheme;

  // State management
  const [bookings, setBookings] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState("all");

  // Load user bookings on component mount
  useEffect(() => {
    if (user) {
      loadUserBookings();
      loadBookingStats();
    }
  }, [user]);

  // Load user's bookings
  const loadUserBookings = async () => {
    try {
      setLoading(true);
      const data = await reservationsAPI.getByUser(user.id);
      setBookings(data || []);
    } catch (error) {
      console.error("Error loading bookings:", error);
      message.error("Failed to load bookings");
      setBookings([]);
    } finally {
      setLoading(false);
    }
  };

  // Load booking statistics
  const loadBookingStats = async () => {
    try {
      const data = await reservationsAPI.getByUser(user.id);

      // Calculate stats from bookings
      const totalBookings = data.length;
      const confirmedBookings = data.filter(
        (b) => b.status === "CONFIRMED"
      ).length;
      const cancelledBookings = data.filter(
        (b) => b.status === "CANCELLED"
      ).length;
      const totalSpent = data
        .filter((b) => b.status === "CONFIRMED")
        .reduce((sum, b) => sum + parseFloat(b.totalAmount || 0), 0);

      setStats({
        totalBookings,
        confirmedBookings,
        cancelledBookings,
        totalSpent,
      });
    } catch (error) {
      console.error("Error loading stats:", error);
    }
  };

  // Filter bookings based on status
  const getFilteredBookings = () => {
    const now = dayjs();

    switch (activeTab) {
      case "upcoming":
        return bookings.filter(
          (booking) =>
            dayjs(booking.checkInDate).isAfter(now) &&
            (booking.status === "CONFIRMED" || booking.status === "confirmed")
        );
      case "current":
        return bookings.filter(
          (booking) =>
            dayjs(booking.checkInDate).isBefore(now) &&
            dayjs(booking.checkOutDate).isAfter(now) &&
            (booking.status === "CONFIRMED" || booking.status === "confirmed")
        );
      case "past":
        return bookings.filter((booking) =>
          dayjs(booking.checkOutDate).isBefore(now)
        );
      case "cancelled":
        return bookings.filter(
          (booking) =>
            booking.status === "CANCELLED" || booking.status === "cancelled"
        );
      default:
        return bookings;
    }
  };

  // View booking details
  const viewBookingDetails = async (reservationId) => {
    try {
      const data = await reservationsAPI.getById(reservationId);
      setSelectedBooking(data);
      setDetailModalVisible(true);
    } catch (error) {
      console.error("Error loading booking details:", error);
      message.error("Failed to load booking details");
    }
  };

  // Cancel booking
  const cancelBooking = (reservationId) => {
    confirm({
      title: "Cancel Booking",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you sure you want to cancel this booking? This action cannot be undone.",
      okText: "Yes, Cancel",
      okType: "danger",
      cancelText: "No, Keep Booking",
      onOk: async () => {
        try {
          await reservationsAPI.cancelReservation(reservationId, user.id);
          message.success("Booking cancelled successfully");
          loadUserBookings(); // Refresh bookings
          loadBookingStats(); // Refresh stats
        } catch (error) {
          console.error("Error cancelling booking:", error);
          message.error(error.message || "Failed to cancel booking");
        }
      },
    });
  };

  // Get status color and text
  const getStatusDisplay = (booking) => {
    const now = dayjs();
    const checkIn = dayjs(booking.check_in_date);
    const checkOut = dayjs(booking.check_out_date);

    if (booking.status === "cancelled") {
      return { color: "red", text: "Cancelled" };
    }

    if (checkIn.isAfter(now)) {
      return { color: "blue", text: "Upcoming" };
    }

    if (checkIn.isBefore(now) && checkOut.isAfter(now)) {
      return { color: "green", text: "Current Stay" };
    }

    if (checkOut.isBefore(now)) {
      return { color: "default", text: "Completed" };
    }

    return { color: "gold", text: "Confirmed" };
  };

  // Can cancel booking (24 hours before check-in)
  const canCancelBooking = (booking) => {
    const checkIn = dayjs(booking.check_in_date);
    const now = dayjs();
    const hoursUntilCheckIn = checkIn.diff(now, "hour");

    return booking.status === "confirmed" && hoursUntilCheckIn > 24;
  };

  // Render statistics cards
  const renderStatsCards = () => (
    <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
      <Col xs={24} sm={8}>
        <StatsCard theme={isDark ? "dark" : "light"}>
          <Statistic
            title="Total Bookings"
            value={stats.totalBookings || 0}
            prefix={<CalendarOutlined />}
          />
        </StatsCard>
      </Col>
      <Col xs={24} sm={8}>
        <StatsCard theme={isDark ? "dark" : "light"}>
          <Statistic
            title="Total Spent"
            value={stats.totalSpent || 0}
            prefix="$"
            precision={2}
          />
        </StatsCard>
      </Col>
      <Col xs={24} sm={8}>
        <StatsCard theme={isDark ? "dark" : "light"}>
          <Statistic
            title="Upcoming Trips"
            value={stats.upcomingBookings || 0}
            prefix={<CheckCircleOutlined />}
          />
        </StatsCard>
      </Col>
    </Row>
  );

  // Render booking card for mobile
  const renderBookingCard = (booking) => {
    const status = getStatusDisplay(booking);

    return (
      <motion.div
        key={booking.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <BookingCard theme={isDark ? "dark" : "light"}>
          <Row gutter={[16, 16]} align="middle">
            <Col span={18}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <div>
                  <Title level={5} style={{ margin: 0 }}>
                    {booking.rooms?.category} - Room{" "}
                    {booking.rooms?.room_number}
                  </Title>
                  <Text type="secondary">{booking.rooms?.hotels?.name}</Text>
                </div>

                <Space wrap>
                  <StatusTag color={status.color}>{status.text}</StatusTag>
                  <Text strong>Ref: {booking.booking_reference}</Text>
                </Space>

                <div>
                  <Space>
                    <CalendarOutlined />
                    <Text>
                      {dayjs(booking.check_in_date).format("MMM DD")} -{" "}
                      {dayjs(booking.check_out_date).format("MMM DD, YYYY")}
                    </Text>
                  </Space>
                </div>

                <div>
                  <Space>
                    <DollarOutlined />
                    <Text strong>${booking.total_amount}</Text>
                    <UserOutlined />
                    <Text>{booking.guests} guests</Text>
                  </Space>
                </div>
              </Space>
            </Col>

            <Col span={6}>
              <Space
                direction="vertical"
                size="small"
                style={{ width: "100%" }}
              >
                <Button
                  size="small"
                  icon={<EyeOutlined />}
                  onClick={() => viewBookingDetails(booking.booking_reference)}
                  block
                >
                  Details
                </Button>

                {canCancelBooking(booking) && (
                  <Button
                    size="small"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => cancelBooking(booking.booking_reference)}
                    block
                  >
                    Cancel
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </BookingCard>
      </motion.div>
    );
  };

  // Table columns for desktop
  const columns = [
    {
      title: "Booking Reference",
      dataIndex: "booking_reference",
      key: "booking_reference",
      render: (text) => <Text strong>{text}</Text>,
    },
    {
      title: "Hotel & Room",
      key: "room_info",
      render: (_, record) => (
        <div>
          <div>
            <Text strong>{record.rooms?.hotels?.name}</Text>
          </div>
          <div>
            <Text type="secondary">
              {record.rooms?.category} - Room {record.rooms?.room_number}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: "Dates",
      key: "dates",
      render: (_, record) => (
        <div>
          <div>
            Check-in: {dayjs(record.check_in_date).format("MMM DD, YYYY")}
          </div>
          <div>
            Check-out: {dayjs(record.check_out_date).format("MMM DD, YYYY")}
          </div>
        </div>
      ),
    },
    {
      title: "Guests",
      dataIndex: "guests",
      key: "guests",
      align: "center",
    },
    {
      title: "Total Amount",
      dataIndex: "total_amount",
      key: "total_amount",
      render: (amount) => <Text strong>${amount}</Text>,
    },
    {
      title: "Status",
      key: "status",
      render: (_, record) => {
        const status = getStatusDisplay(record);
        return <StatusTag color={status.color}>{status.text}</StatusTag>;
      },
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => viewBookingDetails(record.booking_reference)}
          >
            View
          </Button>
          {canCancelBooking(record) && (
            <Button
              size="small"
              danger
              icon={<DeleteOutlined />}
              onClick={() => cancelBooking(record.booking_reference)}
            >
              Cancel
            </Button>
          )}
        </Space>
      ),
    },
  ];

  if (!user) {
    return (
      <BookingsContainer>
        <Alert
          message="Please login to view your bookings"
          type="warning"
          showIcon
        />
      </BookingsContainer>
    );
  }

  return (
    <BookingsContainer isMobile={isMobile}>
      <Title level={2}>My Bookings</Title>

      {renderStatsCards()}

      <Card>
        <Tabs activeKey={activeTab} onChange={setActiveTab}>
          <TabPane tab="All Bookings" key="all" />
          <TabPane tab="Upcoming" key="upcoming" />
          <TabPane tab="Current" key="current" />
          <TabPane tab="Past" key="past" />
          <TabPane tab="Cancelled" key="cancelled" />
        </Tabs>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Spin size="large" />
          </div>
        ) : getFilteredBookings().length === 0 ? (
          <div style={{ textAlign: "center", padding: "40px" }}>
            <Text type="secondary">No bookings found</Text>
          </div>
        ) : isMobile ? (
          getFilteredBookings().map(renderBookingCard)
        ) : (
          <Table
            columns={columns}
            dataSource={getFilteredBookings()}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
            }}
          />
        )}
      </Card>

      {/* Booking Detail Modal */}
      <Modal
        title="Booking Details"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setDetailModalVisible(false)}>
            Close
          </Button>,
          selectedBooking && canCancelBooking(selectedBooking) && (
            <Button
              key="cancel"
              danger
              onClick={() => {
                setDetailModalVisible(false);
                cancelBooking(selectedBooking.booking_reference);
              }}
            >
              Cancel Booking
            </Button>
          ),
        ]}
        width={800}
      >
        {selectedBooking && (
          <div>
            <Descriptions title="Booking Information" bordered column={2}>
              <Descriptions.Item label="Booking Reference" span={2}>
                <Text strong>{selectedBooking.booking_reference}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Hotel">
                {selectedBooking.rooms?.hotels?.name}
              </Descriptions.Item>
              <Descriptions.Item label="Room">
                {selectedBooking.rooms?.category} - Room{" "}
                {selectedBooking.rooms?.room_number}
              </Descriptions.Item>
              <Descriptions.Item label="Check-in">
                {dayjs(selectedBooking.check_in_date).format("MMMM DD, YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Check-out">
                {dayjs(selectedBooking.check_out_date).format("MMMM DD, YYYY")}
              </Descriptions.Item>
              <Descriptions.Item label="Guests">
                {selectedBooking.guests}
              </Descriptions.Item>
              <Descriptions.Item label="Total Amount">
                <Text strong>${selectedBooking.total_amount}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Status" span={2}>
                {(() => {
                  const status = getStatusDisplay(selectedBooking);
                  return (
                    <StatusTag color={status.color}>{status.text}</StatusTag>
                  );
                })()}
              </Descriptions.Item>
            </Descriptions>

            <Divider />

            <Descriptions title="Guest Information" bordered column={2}>
              <Descriptions.Item label="Guest Name">
                {selectedBooking.guest_name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                <Space>
                  <MailOutlined />
                  {selectedBooking.guest_email}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Phone">
                <Space>
                  <PhoneOutlined />
                  {selectedBooking.guest_phone}
                </Space>
              </Descriptions.Item>
              <Descriptions.Item label="Special Requests" span={2}>
                {selectedBooking.special_requests || "None"}
              </Descriptions.Item>
            </Descriptions>

            {selectedBooking.rooms?.hotels && (
              <>
                <Divider />
                <Descriptions title="Hotel Information" bordered column={2}>
                  <Descriptions.Item label="Hotel Name">
                    {selectedBooking.rooms.hotels.name}
                  </Descriptions.Item>
                  <Descriptions.Item label="Rating">
                    <Rate
                      disabled
                      defaultValue={selectedBooking.rooms.hotels.rating}
                    />
                  </Descriptions.Item>
                  <Descriptions.Item label="Address" span={2}>
                    <Space>
                      <HomeOutlined />
                      {selectedBooking.rooms.hotels.address}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <Space>
                      <PhoneOutlined />
                      {selectedBooking.rooms.hotels.phone}
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Space>
                      <MailOutlined />
                      {selectedBooking.rooms.hotels.email}
                    </Space>
                  </Descriptions.Item>
                </Descriptions>
              </>
            )}
          </div>
        )}
      </Modal>
    </BookingsContainer>
  );
};

export default UserBookingsPage;
