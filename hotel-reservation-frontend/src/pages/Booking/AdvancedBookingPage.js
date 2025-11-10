import React, { useState, useEffect } from "react";
import {
  Card,
  Row,
  Col,
  DatePicker,
  Select,
  Button,
  Typography,
  Space,
  InputNumber,
  Divider,
  Tag,
  Skeleton,
  Empty,
  Modal,
  Form,
  Input,
  message,
  Spin,
  Alert,
  Rate,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  StarFilled,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
  HomeOutlined,
  CheckCircleOutlined,
  LoadingOutlined,
  SearchOutlined,
  FilterOutlined,
  HeartOutlined,
  SwimmingPoolOutlined,
  DollarOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import dayjs from "dayjs";
import styled from "styled-components";
import { useResponsive } from "../../utils/responsive";
import { lightTheme, darkTheme } from "../../styles/theme";
import { useUIStore } from "../../store";
import { roomsAPI, reservationsAPI } from "../../lib/api";
import { useAuth } from "../../hooks/useAuth";

const { RangePicker } = DatePicker;
const { Title, Text } = Typography;
const { Option } = Select;

// Styled Components
const BookingContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})`
  max-width: 1200px;
  margin: 0 auto;
  padding: ${(props) => (props.isMobile ? "16px" : "24px")};
`;

const SearchCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})`
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

  .ant-card-body {
    padding: ${(props) => (props.isMobile ? "16px" : "24px")};
  }
`;

const RoomCard = styled(Card).withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})`
  margin-bottom: 20px;
  border-radius: 12px;
  transition: all 0.3s ease;
  border: 1px solid
    ${(props) =>
      props.theme === "dark" ? darkTheme.border : lightTheme.border};

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .ant-card-body {
    padding: ${(props) => (props.isMobile ? "16px" : "20px")};
  }
`;

const RoomImage = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})`
  width: 100%;
  height: ${(props) => (props.isMobile ? "200px" : "250px")};
  background: linear-gradient(45deg, #f0f2f5, #d9d9d9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: ${(props) => (props.isMobile ? "48px" : "64px")};
  color: #8c8c8c;
  margin-bottom: 16px;
`;

const PriceTag = styled.div`
  background: ${(props) =>
    props.theme === "dark" ? darkTheme.primary : lightTheme.primary};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: ${(props) => (props.isMobile ? "16px" : "18px")};
  text-align: center;
`;

const AmenityTag = styled(Tag)`
  margin: 2px;
  border-radius: 16px;
  padding: 4px 8px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

// Sample room data - In real app, this would come from Supabase
const SAMPLE_ROOMS = [
  {
    id: 1,
    name: "Deluxe Ocean View Suite",
    type: "Suite",
    capacity: 2,
    basePrice: 350,
    rating: 4.8,
    amenities: ["WiFi", "Parking", "Breakfast", "Ocean View"],
    available: true,
    description:
      "Spacious suite with stunning ocean views and premium amenities.",
  },
  {
    id: 2,
    name: "Executive Business Room",
    type: "Business",
    capacity: 1,
    basePrice: 220,
    rating: 4.6,
    amenities: ["WiFi", "Business Center", "Breakfast"],
    available: true,
    description: "Perfect for business travelers with dedicated workspace.",
  },
  {
    id: 3,
    name: "Family Garden Villa",
    type: "Villa",
    capacity: 4,
    basePrice: 480,
    rating: 4.9,
    amenities: ["WiFi", "Parking", "Garden", "Kitchen"],
    available: false,
    description: "Spacious villa with private garden, ideal for families.",
  },
];

const AMENITY_ICONS = {
  WiFi: <WifiOutlined />,
  Parking: <CarOutlined />,
  Breakfast: <CoffeeOutlined />,
  "Ocean View": <HomeOutlined />,
  "Business Center": <HomeOutlined />,
  Garden: <HomeOutlined />,
  Kitchen: <HomeOutlined />,
};

const AdvancedBookingPage = () => {
  const [searchParams, setSearchParams] = useState({
    dates: null,
    guests: 1,
    roomType: "all",
  });
  const [availableRooms, setAvailableRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchCompleted, setSearchCompleted] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [bookingModalVisible, setBookingModalVisible] = useState(false);
  const [bookingForm] = Form.useForm();
  const [bookingLoading, setBookingLoading] = useState(false);

  const { isMobile } = useResponsive();
  const { theme } = useUIStore();
  const { user } = useAuth();

  // Search for available rooms using BookingService
  const handleSearch = async () => {
    if (
      !searchParams.dates ||
      !searchParams.dates[0] ||
      !searchParams.dates[1]
    ) {
      message.warning("Please select check-in and check-out dates");
      return;
    }

    setLoading(true);
    try {
      const checkIn = searchParams.dates[0].format("YYYY-MM-DD");
      const checkOut = searchParams.dates[1].format("YYYY-MM-DD");

      // Use Spring Boot API to get all rooms and filter client-side
      const allRooms = await roomsAPI.getAll();

      // Filter by capacity and room type
      let filteredRooms = allRooms.filter(
        (room) => room.capacity >= searchParams.guests && room.isActive === true
      );

      if (searchParams.roomType && searchParams.roomType !== "all") {
        filteredRooms = filteredRooms.filter(
          (room) => room.category === searchParams.roomType
        );
      }

      setAvailableRooms(filteredRooms);
      setSearchCompleted(true);
      message.success(`Found ${filteredRooms.length} available rooms`);
    } catch (error) {
      console.error("Search error:", error);
      message.error("Failed to search for rooms");
      setAvailableRooms([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle room booking
  const handleBooking = (room) => {
    if (!user) {
      message.warning("Please login to make a booking");
      return;
    }

    setSelectedRoom(room);
    setBookingModalVisible(true);

    // Pre-fill form with search data
    bookingForm.setFieldsValue({
      checkIn: searchParams.dates[0],
      checkOut: searchParams.dates[1],
      guests: searchParams.guests,
      roomType: room.category,
      totalAmount: room.pricing?.grandTotal || room.base_price,
    });
  };

  // Submit booking using Spring Boot API
  const submitBooking = async (values) => {
    if (!user || !selectedRoom) return;

    setBookingLoading(true);
    try {
      const bookingData = {
        userId: user.id,
        roomId: selectedRoom.id,
        checkIn: values.checkIn.format("YYYY-MM-DD"),
        checkOut: values.checkOut.format("YYYY-MM-DD"),
        guestCount: values.guests,
        guestName: `${values.firstName} ${values.lastName}`,
        guestEmail: values.email,
        guestPhone: values.phone,
        specialRequests: values.specialRequests || "",
      };

      const result = await reservationsAPI.createReservation(bookingData);

      if (result.success) {
        message.success(
          `Booking confirmed! Reference: ${result.reservation.confirmationNumber}`
        );
        setBookingModalVisible(false);
        bookingForm.resetFields();

        // Refresh search results
        await handleSearch();
      } else {
        message.error(result.message || "Failed to create booking");
      }
    } catch (error) {
      console.error("Booking error:", error);
      message.error(error.message || "Failed to complete booking");
    } finally {
      setBookingLoading(false);
    }
  };

  // Calculate price based on room and dates
  const calculatePrice = (room, dates) => {
    if (!room || !dates || !dates[0] || !dates[1]) {
      return 0;
    }

    const checkIn = new Date(dates[0]);
    const checkOut = new Date(dates[1]);
    const nights = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));

    return (room.basePrice * nights).toFixed(2);
  };

  const renderSearchForm = () => (
    <SearchCard isMobile={isMobile}>
      <Title level={isMobile ? 4 : 3} style={{ marginBottom: "20px" }}>
        Find Your Perfect Room
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>Check-in & Check-out</Text>
            <RangePicker
              size={isMobile ? "middle" : "large"}
              style={{ width: "100%" }}
              placeholder={["Check-in", "Check-out"]}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              value={searchParams.dates}
              onChange={(dates) =>
                setSearchParams((prev) => ({ ...prev, dates }))
              }
              format="MMM DD, YYYY"
            />
          </Space>
        </Col>

        <Col xs={12} md={4}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>Guests</Text>
            <InputNumber
              size={isMobile ? "middle" : "large"}
              style={{ width: "100%" }}
              min={1}
              max={8}
              value={searchParams.guests}
              onChange={(value) =>
                setSearchParams((prev) => ({ ...prev, guests: value }))
              }
              prefix={<UserOutlined />}
            />
          </Space>
        </Col>

        <Col xs={12} md={6}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>Room Type</Text>
            <Select
              size={isMobile ? "middle" : "large"}
              style={{ width: "100%" }}
              value={searchParams.roomType}
              onChange={(value) =>
                setSearchParams((prev) => ({ ...prev, roomType: value }))
              }
            >
              <Option value="all">All Types</Option>
              <Option value="suite">Suite</Option>
              <Option value="business">Business</Option>
              <Option value="villa">Villa</Option>
            </Select>
          </Space>
        </Col>

        <Col xs={24} md={6}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>&nbsp;</Text>
            <Button
              type="primary"
              size={isMobile ? "middle" : "large"}
              icon={<CalendarOutlined />}
              onClick={handleSearch}
              loading={loading}
              block
            >
              Search Rooms
            </Button>
          </Space>
        </Col>
      </Row>
    </SearchCard>
  );

  const renderRoomCard = (room) => {
    const pricing = room.pricing || {
      totalPrice: room.base_price,
      nights: 1,
      grandTotal: room.base_price,
    };

    const nights = searchParams.dates
      ? searchParams.dates[1].diff(searchParams.dates[0], "day")
      : 1;

    // Map amenities to display format
    const displayAmenities = room.amenities || [
      "WiFi",
      "Parking",
      "Room Service",
    ];
    const hotelName = room.hotels?.name || "Luxury Hotel";
    const hotelRating = room.hotels?.rating || 4.5;

    return (
      <motion.div
        key={room.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <RoomCard theme={theme} isMobile={isMobile}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <RoomImage isMobile={isMobile}>
                {room.image_url ? (
                  <img
                    src={room.image_url}
                    alt={room.room_number}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
                  "🏨"
                )}
              </RoomImage>
            </Col>

            <Col xs={24} md={10}>
              <Space direction="vertical" style={{ width: "100%" }}>
                <div>
                  <Title level={isMobile ? 5 : 4} style={{ margin: 0 }}>
                    {room.category} - Room {room.room_number}
                  </Title>
                  <Text
                    type="secondary"
                    style={{ fontSize: "14px", display: "block" }}
                  >
                    {hotelName}
                  </Text>
                  <Space style={{ marginTop: "4px" }}>
                    <Rate
                      disabled
                      defaultValue={hotelRating}
                      style={{ fontSize: "14px" }}
                    />
                    <Text strong>{hotelRating}</Text>
                    <Text type="secondary">• Up to {room.capacity} guests</Text>
                  </Space>
                </div>

                <Text type="secondary">
                  {room.description ||
                    `Comfortable ${room.category.toLowerCase()} room with modern amenities.`}
                </Text>

                <div>
                  <Text
                    strong
                    style={{ marginBottom: "8px", display: "block" }}
                  >
                    Amenities:
                  </Text>
                  <div>
                    {displayAmenities.map((amenity) => (
                      <AmenityTag key={amenity} icon={AMENITY_ICONS[amenity]}>
                        {amenity}
                      </AmenityTag>
                    ))}
                  </div>
                </div>

                {pricing.breakdown && (
                  <div>
                    <Text strong style={{ fontSize: "12px", color: "#666" }}>
                      Price breakdown ({pricing.nights} nights):
                    </Text>
                    <div
                      style={{
                        fontSize: "11px",
                        color: "#888",
                        marginTop: "4px",
                      }}
                    >
                      Base: ${pricing.basePrice}/night × {pricing.nights} = $
                      {pricing.totalPrice}
                      <br />
                      Taxes & Fees: ${pricing.taxes + pricing.fees}
                    </div>
                  </div>
                )}
              </Space>
            </Col>

            <Col xs={24} md={6}>
              <Space
                direction="vertical"
                style={{ width: "100%", textAlign: "center" }}
                size="middle"
              >
                <div>
                  <Text type="secondary">
                    {nights > 1 ? `${nights} nights total` : "Per night"}
                  </Text>
                  <PriceTag theme={theme} isMobile={isMobile}>
                    $
                    {pricing.grandTotal ||
                      pricing.totalPrice ||
                      room.base_price}
                  </PriceTag>
                  {pricing.pricePerNight && nights > 1 && (
                    <Text
                      type="secondary"
                      style={{
                        fontSize: "12px",
                        display: "block",
                        marginTop: "4px",
                      }}
                    >
                      ${pricing.pricePerNight} / night
                    </Text>
                  )}
                </div>

                <Button
                  type="primary"
                  size={isMobile ? "middle" : "large"}
                  onClick={() => handleBooking(room)}
                  block
                  disabled={!room.is_active}
                >
                  {room.is_active !== false ? "Book Now" : "Unavailable"}
                </Button>
              </Space>
            </Col>
          </Row>
        </RoomCard>
      </motion.div>
    );
  };

  return (
    <BookingContainer isMobile={isMobile}>
      {renderSearchForm()}

      <div>
        {loading ? (
          <Space direction="vertical" style={{ width: "100%" }}>
            {[1, 2, 3].map((i) => (
              <Card key={i} style={{ marginBottom: "20px" }}>
                <Skeleton active avatar paragraph={{ rows: 3 }} />
              </Card>
            ))}
          </Space>
        ) : availableRooms.length > 0 ? (
          <div>
            <Title level={isMobile ? 5 : 4} style={{ marginBottom: "20px" }}>
              Available Rooms ({availableRooms.length})
            </Title>
            {availableRooms.map(renderRoomCard)}
          </div>
        ) : searchParams.dates ? (
          <Card>
            <Empty
              description="No rooms available for selected dates"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            />
          </Card>
        ) : (
          <Card>
            <div style={{ textAlign: "center", padding: "40px 20px" }}>
              <CalendarOutlined
                style={{
                  fontSize: "48px",
                  color: "#d9d9d9",
                  marginBottom: "16px",
                }}
              />
              <Title level={4} type="secondary">
                Search for Available Rooms
              </Title>
              <Text type="secondary">
                Select your dates and preferences to see available rooms
              </Text>
            </div>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        title={
          <Space>
            <CheckCircleOutlined style={{ color: "#52c41a" }} />
            Confirm Your Booking
          </Space>
        }
        open={bookingModalVisible}
        onCancel={() => setBookingModalVisible(false)}
        width={isMobile ? "95%" : 600}
        footer={null}
      >
        {selectedRoom && (
          <div>
            <Card style={{ marginBottom: "20px", background: "#f5f5f5" }}>
              <Row gutter={16}>
                <Col span={16}>
                  <Title level={5} style={{ margin: 0 }}>
                    {selectedRoom.name}
                  </Title>
                  <Text type="secondary">
                    {searchParams.dates &&
                      searchParams.dates[0] &&
                      searchParams.dates[1] && (
                        <>
                          {searchParams.dates[0].format("MMM DD")} -{" "}
                          {searchParams.dates[1].format("MMM DD, YYYY")}•{" "}
                          {searchParams.guests} guests
                        </>
                      )}
                  </Text>
                </Col>
                <Col span={8} style={{ textAlign: "right" }}>
                  <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
                    ${calculatePrice(selectedRoom, searchParams.dates)}
                  </Title>
                </Col>
              </Row>
            </Card>

            <Form form={bookingForm} layout="vertical" onFinish={submitBooking}>
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="First Name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your first name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter first name" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Last Name"
                    rules={[
                      {
                        required: true,
                        message: "Please enter your last name",
                      },
                    ]}
                  >
                    <Input placeholder="Enter last name" />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="email"
                label="Email Address"
                rules={[
                  { required: true, message: "Please enter your email" },
                  { type: "email", message: "Please enter a valid email" },
                ]}
              >
                <Input placeholder="Enter email address" />
              </Form.Item>

              <Form.Item
                name="phone"
                label="Phone Number"
                rules={[
                  { required: true, message: "Please enter your phone number" },
                ]}
              >
                <Input placeholder="Enter phone number" />
              </Form.Item>

              <Form.Item
                name="specialRequests"
                label="Special Requests (Optional)"
              >
                <Input.TextArea
                  rows={3}
                  placeholder="Any special requests or notes..."
                />
              </Form.Item>

              <Divider />

              <Row gutter={16}>
                <Col span={12}>
                  <Button
                    size="large"
                    block
                    onClick={() => setBookingModalVisible(false)}
                  >
                    Cancel
                  </Button>
                </Col>
                <Col span={12}>
                  <Form.Item style={{ margin: 0 }}>
                    <Button type="primary" htmlType="submit" size="large" block>
                      Confirm Booking
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        )}
      </Modal>
    </BookingContainer>
  );
};

export default AdvancedBookingPage;
