import React, { useState, useEffect } from "react";
import {
  Typography,
  Card,
  Row,
  Col,
  Button,
  Space,
  Spin,
  Alert,
  DatePicker,
  Select,
  InputNumber,
  Tag,
  Rate,
  Divider,
  Empty,
  message,
  Modal,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  SearchOutlined,
  HomeOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import styled from "styled-components";
import dayjs from "dayjs";
import { roomsAPI } from "../../lib/api";
import { useResponsive } from "../../utils/responsive";
import BookingForm from "../../components/BookingForm";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

// Styled Components
const RoomsContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const RoomCard = styled(Card)`
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const RoomImage = styled.div`
  width: 100%;
  height: 200px;
  background: linear-gradient(45deg, #f0f2f5, #d9d9d9);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 48px;
  color: #8c8c8c;
  margin-bottom: 16px;
`;

const PriceTag = styled.div`
  background: #1890ff;
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-weight: 600;
  font-size: 18px;
  text-align: center;
`;

const AMENITY_ICONS = {
  WiFi: <WifiOutlined />,
  Parking: <CarOutlined />,
  Breakfast: <CoffeeOutlined />,
  "Room Service": <HomeOutlined />,
};

const RoomsPage = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [isBookingModalVisible, setIsBookingModalVisible] = useState(false);
  const [isDetailsModalVisible, setIsDetailsModalVisible] = useState(false);
  const [searchParams, setSearchParams] = useState({
    checkIn: null,
    checkOut: null,
    capacity: 1,
    category: "all",
  });

  const { isMobile } = useResponsive();

  // Fetch all rooms on component mount
  useEffect(() => {
    fetchAllRooms();
  }, []);

  const fetchAllRooms = async () => {
    try {
      setLoading(true);
      console.log("🏠 Fetching all rooms...");
      const data = await roomsAPI.getAll();
      console.log("🏠 Rooms data:", data);
      setRooms(data || []);
      setError(null);
    } catch (error) {
      console.error("🏠 Error fetching rooms:", error);
      setError("Failed to load rooms. Please try again.");
      setRooms([]);
    } finally {
      setLoading(false);
    }
  };

  const handleBookNow = (room) => {
    // Check if user is logged in
    const user = JSON.parse(localStorage.getItem("user_data"));
    if (!user) {
      message.warning("Please login to book a room");
      // You can redirect to login page here if needed
      return;
    }

    setSelectedRoom(room);
    setIsBookingModalVisible(true);
  };

  const handleBookingSuccess = (reservation) => {
    setIsBookingModalVisible(false);
    message.success("Booking completed successfully!");
    // You can redirect to bookings page or show confirmation
    console.log("Booking successful:", reservation);
  };

  const handleBookingCancel = () => {
    setIsBookingModalVisible(false);
    setSelectedRoom(null);
  };

  const handleViewDetails = (room) => {
    setSelectedRoom(room);
    setIsDetailsModalVisible(true);
  };

  const handleDetailsClose = () => {
    setIsDetailsModalVisible(false);
    setSelectedRoom(null);
  };

  const handleSearch = async () => {
    if (!searchParams.checkIn || !searchParams.checkOut) {
      message.warning("Please select check-in and check-out dates");
      return;
    }

    try {
      setSearching(true);
      console.log("🔍 Searching rooms with params:", searchParams);

      const searchData = await roomsAPI.getAll(); // For now, get all rooms and filter client-side

      // TODO: Use proper search endpoint when available
      // const searchData = await roomsAPI.search({
      //   checkIn: searchParams.checkIn.format("YYYY-MM-DD"),
      //   checkOut: searchParams.checkOut.format("YYYY-MM-DD"),
      //   capacity: searchParams.capacity,
      //   category: searchParams.category === "all" ? null : searchParams.category,
      // });

      console.log("🔍 Search results:", searchData);
      setRooms(searchData || []);
      message.success(`Found ${searchData?.length || 0} rooms`);
    } catch (error) {
      console.error("🔍 Search error:", error);
      message.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const renderSearchForm = () => (
    <SearchCard>
      <Title level={4} style={{ marginBottom: "20px" }}>
        Search Available Rooms
      </Title>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={8}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>Check-in & Check-out</Text>
            <RangePicker
              size="large"
              style={{ width: "100%" }}
              placeholder={["Check-in", "Check-out"]}
              disabledDate={(current) =>
                current && current < dayjs().startOf("day")
              }
              value={
                searchParams.checkIn && searchParams.checkOut
                  ? [searchParams.checkIn, searchParams.checkOut]
                  : null
              }
              onChange={(dates) =>
                setSearchParams((prev) => ({
                  ...prev,
                  checkIn: dates?.[0] || null,
                  checkOut: dates?.[1] || null,
                }))
              }
              format="MMM DD, YYYY"
            />
          </Space>
        </Col>

        <Col xs={12} md={4}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>Guests</Text>
            <InputNumber
              size="large"
              style={{ width: "100%" }}
              min={1}
              max={8}
              value={searchParams.capacity}
              onChange={(value) =>
                setSearchParams((prev) => ({ ...prev, capacity: value }))
              }
              prefix={<UserOutlined />}
            />
          </Space>
        </Col>

        <Col xs={12} md={6}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>Room Type</Text>
            <Select
              size="large"
              style={{ width: "100%" }}
              value={searchParams.category}
              onChange={(value) =>
                setSearchParams((prev) => ({ ...prev, category: value }))
              }
            >
              <Option value="all">All Types</Option>
              <Option value="STANDARD">Standard</Option>
              <Option value="DELUXE">Deluxe</Option>
              <Option value="SUITE">Suite</Option>
              <Option value="PREMIUM">Premium</Option>
            </Select>
          </Space>
        </Col>

        <Col xs={24} md={6}>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Text strong>&nbsp;</Text>
            <Button
              type="primary"
              size="large"
              icon={<SearchOutlined />}
              onClick={handleSearch}
              loading={searching}
              block
            >
              Search Rooms
            </Button>
          </Space>
        </Col>
      </Row>
    </SearchCard>
  );

  const renderRoomCard = (room) => (
    <motion.div
      key={room.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <RoomCard>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <RoomImage>🏨</RoomImage>
          </Col>

          <Col xs={24} md={10}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Title level={4} style={{ margin: 0 }}>
                  {room.category} - Room {room.roomNumber}
                </Title>
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  {room.hotels?.name || "Luxury Hotel"}
                </Text>
                <div style={{ marginTop: "4px" }}>
                  <Rate
                    disabled
                    defaultValue={4.5}
                    style={{ fontSize: "14px" }}
                  />
                  <Text style={{ marginLeft: "8px" }}>4.5</Text>
                  <Text type="secondary"> • Up to {room.capacity} guests</Text>
                </div>
              </div>

              <Text type="secondary">
                {room.description ||
                  `Comfortable ${room.category.toLowerCase()} room with modern amenities.`}
              </Text>

              <div>
                <Text strong style={{ marginBottom: "8px", display: "block" }}>
                  Amenities:
                </Text>
                <div>
                  {["WiFi", "Room Service", "Breakfast"].map((amenity) => (
                    <Tag
                      key={amenity}
                      icon={AMENITY_ICONS[amenity]}
                      style={{ margin: "2px" }}
                    >
                      {amenity}
                    </Tag>
                  ))}
                </div>
              </div>

              <div>
                <Tag color={room.isActive ? "green" : "red"}>
                  {room.isActive ? "Available" : "Unavailable"}
                </Tag>
              </div>
            </Space>
          </Col>

          <Col xs={24} md={6}>
            <Space
              direction="vertical"
              style={{ width: "100%", textAlign: "center" }}
              size="middle"
            >
              <div>
                <Text type="secondary">Per night</Text>
                <PriceTag>${room.basePrice}</PriceTag>
              </div>

              <Button
                type="primary"
                size="large"
                block
                disabled={!room.isActive}
                onClick={() => handleBookNow(room)}
              >
                {room.isActive ? "Book Now" : "Unavailable"}
              </Button>

              <Button
                size="large"
                block
                onClick={() => handleViewDetails(room)}
              >
                View Details
              </Button>
            </Space>
          </Col>
        </Row>
      </RoomCard>
    </motion.div>
  );

  if (loading) {
    return (
      <RoomsContainer>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Spin size="large" tip="Loading rooms..." />
        </div>
      </RoomsContainer>
    );
  }

  return (
    <RoomsContainer>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Available Rooms</Title>
        <Text type="secondary">
          Discover our luxury accommodations and find your perfect stay
        </Text>
      </div>

      {renderSearchForm()}

      {error && (
        <Alert
          message="Error"
          description={error}
          type="error"
          showIcon
          closable
          onClose={() => setError(null)}
          style={{ marginBottom: "24px" }}
        />
      )}

      <div>
        {rooms.length > 0 ? (
          <>
            <Title level={4} style={{ marginBottom: "20px" }}>
              {rooms.length} Room{rooms.length !== 1 ? "s" : ""} Available
            </Title>
            {rooms.map(renderRoomCard)}
          </>
        ) : (
          <Card>
            <Empty
              description="No rooms available"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={fetchAllRooms}>
                Refresh
              </Button>
            </Empty>
          </Card>
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        title="Complete Your Booking"
        open={isBookingModalVisible}
        onCancel={handleBookingCancel}
        footer={null}
        width={1000}
        destroyOnHidden
      >
        {selectedRoom && (
          <BookingForm
            room={selectedRoom}
            onSuccess={handleBookingSuccess}
            onCancel={handleBookingCancel}
          />
        )}
      </Modal>

      {/* Room Details Modal */}
      <Modal
        title={`${selectedRoom?.category || ""} Room - ${
          selectedRoom?.roomNumber || ""
        }`}
        open={isDetailsModalVisible}
        onCancel={handleDetailsClose}
        footer={[
          <Button key="close" onClick={handleDetailsClose}>
            Close
          </Button>,
          <Button
            key="book"
            type="primary"
            onClick={() => {
              handleDetailsClose();
              if (selectedRoom) {
                handleBookNow(selectedRoom);
              }
            }}
            disabled={!selectedRoom?.isActive}
          >
            Book Now
          </Button>,
        ]}
        width={800}
      >
        {selectedRoom && (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <RoomImage>🏨</RoomImage>

            <div>
              <Title level={4}>Room Details</Title>
              <Divider />
              <Row gutter={[16, 16]}>
                <Col span={12}>
                  <Text strong>Room Number:</Text>
                  <div>{selectedRoom.roomNumber}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Category:</Text>
                  <div>{selectedRoom.category}</div>
                </Col>
                <Col span={12}>
                  <Text strong>Capacity:</Text>
                  <div>Up to {selectedRoom.capacity} guests</div>
                </Col>
                <Col span={12}>
                  <Text strong>Price per Night:</Text>
                  <div>
                    <Text
                      style={{
                        fontSize: "20px",
                        fontWeight: "bold",
                        color: "#1890ff",
                      }}
                    >
                      ${selectedRoom.basePrice}
                    </Text>
                  </div>
                </Col>
                <Col span={24}>
                  <Text strong>Status:</Text>
                  <div>
                    <Tag color={selectedRoom.isActive ? "green" : "red"}>
                      {selectedRoom.isActive ? "Available" : "Unavailable"}
                    </Tag>
                  </div>
                </Col>
              </Row>
            </div>

            <div>
              <Title level={4}>Description</Title>
              <Divider />
              <Text>
                {selectedRoom.description ||
                  `Experience comfort and luxury in our ${selectedRoom.category.toLowerCase()} room. 
                  This beautifully appointed accommodation features modern amenities and elegant decor, 
                  perfect for both business and leisure travelers.`}
              </Text>
            </div>

            <div>
              <Title level={4}>Amenities</Title>
              <Divider />
              <Space wrap>
                <Tag icon={<WifiOutlined />} color="blue">
                  Free WiFi
                </Tag>
                <Tag icon={<HomeOutlined />} color="blue">
                  Room Service
                </Tag>
                <Tag icon={<CoffeeOutlined />} color="blue">
                  Complimentary Breakfast
                </Tag>
                <Tag icon={<CarOutlined />} color="blue">
                  Parking Available
                </Tag>
              </Space>
            </div>

            <div>
              <Title level={4}>Hotel Information</Title>
              <Divider />
              <Space direction="vertical">
                <div>
                  <Text strong>Hotel:</Text>{" "}
                  {selectedRoom.hotels?.name || "Luxury Hotel"}
                </div>
                <div>
                  <Text strong>Rating:</Text>{" "}
                  <Rate
                    disabled
                    defaultValue={4.5}
                    style={{ fontSize: "14px" }}
                  />
                </div>
              </Space>
            </div>
          </Space>
        )}
      </Modal>
    </RoomsContainer>
  );
};

export default RoomsPage;
