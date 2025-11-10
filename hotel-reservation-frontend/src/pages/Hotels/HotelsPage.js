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
  Input,
  Tag,
  Empty,
  message,
} from "antd";
import {
  SearchOutlined,
  EnvironmentOutlined,
  StarFilled,
  StarOutlined,
  PhoneOutlined,
  MailOutlined,
  WifiOutlined,
  CarOutlined,
  CoffeeOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { hotelsAPI } from "../../lib/api";

const { Title, Text } = Typography;
const { Search } = Input;

// Styled Components
const HotelsContainer = styled.div`
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
`;

const SearchCard = styled(Card)`
  margin-bottom: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
`;

const HotelCard = styled(Card)`
  border-radius: 12px;
  transition: all 0.3s ease;
  margin-bottom: 20px;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }
`;

const HotelImage = styled.div`
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

const RatingBadge = styled.div`
  background: #1890ff;
  color: white;
  padding: 4px 12px;
  border-radius: 16px;
  font-weight: 600;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
`;

const AMENITY_ICONS = {
  WiFi: <WifiOutlined />,
  Parking: <CarOutlined />,
  Restaurant: <CoffeeOutlined />,
  Pool: <StarOutlined />,
  Spa: <StarFilled />,
  Gym: <StarFilled />,
};

const HotelsPage = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const navigate = useNavigate();

  // Fetch all hotels on component mount
  useEffect(() => {
    fetchAllHotels();
  }, []);

  const fetchAllHotels = async () => {
    try {
      setLoading(true);
      console.log("🏨 Fetching all hotels...");
      const data = await hotelsAPI.getAll();
      console.log("🏨 Hotels data:", data);
      setHotels(data || []);
      setError(null);
    } catch (error) {
      console.error("🏨 Error fetching hotels:", error);
      setError("Failed to load hotels. Please try again.");
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (value) => {
    if (!value.trim()) {
      fetchAllHotels();
      return;
    }

    try {
      setSearching(true);
      console.log("🔍 Searching hotels with query:", value);

      // For now, filter client-side since we don't have search implemented
      const filteredHotels = hotels.filter(
        (hotel) =>
          hotel.name.toLowerCase().includes(value.toLowerCase()) ||
          hotel.location.toLowerCase().includes(value.toLowerCase())
      );

      setHotels(filteredHotels);
      message.success(`Found ${filteredHotels.length} hotels`);
    } catch (error) {
      console.error("🔍 Search error:", error);
      message.error("Search failed. Please try again.");
    } finally {
      setSearching(false);
    }
  };

  const viewHotelRooms = (hotelId) => {
    navigate(`/rooms?hotelId=${hotelId}`);
  };

  const renderSearchForm = () => (
    <SearchCard>
      <Title level={4} style={{ marginBottom: "20px" }}>
        Find Your Perfect Hotel
      </Title>

      <Search
        placeholder="Search by hotel name or location..."
        allowClear
        enterButton={<SearchOutlined />}
        size="large"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onSearch={handleSearch}
        loading={searching}
        style={{ maxWidth: "500px" }}
      />
    </SearchCard>
  );

  const renderHotelCard = (hotel) => (
    <motion.div
      key={hotel.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <HotelCard>
        <Row gutter={[16, 16]}>
          <Col xs={24} md={8}>
            <HotelImage>🏨</HotelImage>
          </Col>

          <Col xs={24} md={10}>
            <Space direction="vertical" style={{ width: "100%" }}>
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  {hotel.name}
                </Title>
                <Text
                  type="secondary"
                  style={{
                    fontSize: "16px",
                    display: "flex",
                    alignItems: "center",
                    marginTop: "4px",
                  }}
                >
                  <EnvironmentOutlined style={{ marginRight: "4px" }} />
                  {hotel.location}
                </Text>
                <div style={{ marginTop: "8px" }}>
                  <RatingBadge>
                    <StarFilled />
                    {hotel.rating || 4.5}
                  </RatingBadge>
                </div>
              </div>

              <Text style={{ fontSize: "14px", lineHeight: "1.6" }}>
                {hotel.description ||
                  "Experience luxury and comfort at this premium hotel with world-class amenities and exceptional service."}
              </Text>

              <div>
                <Text strong style={{ marginBottom: "8px", display: "block" }}>
                  Amenities:
                </Text>
                <div>
                  {["WiFi", "Parking", "Restaurant", "Pool"].map((amenity) => (
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

              <Space>
                {hotel.phone && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    <PhoneOutlined /> {hotel.phone}
                  </Text>
                )}
                {hotel.email && (
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    <MailOutlined /> {hotel.email}
                  </Text>
                )}
              </Space>

              <div>
                <Tag color={hotel.isActive ? "green" : "red"}>
                  {hotel.isActive ? "Open" : "Closed"}
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
                <Text type="secondary" style={{ fontSize: "14px" }}>
                  Starting from
                </Text>
                <Title level={4} style={{ margin: "4px 0", color: "#1890ff" }}>
                  $199/night
                </Title>
                <Text type="secondary" style={{ fontSize: "12px" }}>
                  (excluding taxes)
                </Text>
              </div>

              <Button
                type="primary"
                size="large"
                block
                onClick={() => viewHotelRooms(hotel.id)}
                disabled={!hotel.isActive}
              >
                {hotel.isActive ? "View Rooms" : "Currently Closed"}
              </Button>

              <Button size="large" block disabled={!hotel.isActive}>
                Hotel Details
              </Button>
            </Space>
          </Col>
        </Row>
      </HotelCard>
    </motion.div>
  );

  if (loading) {
    return (
      <HotelsContainer>
        <div style={{ textAlign: "center", padding: "60px 20px" }}>
          <Spin size="large" tip="Loading hotels..." />
        </div>
      </HotelsContainer>
    );
  }

  return (
    <HotelsContainer>
      <div style={{ marginBottom: "24px" }}>
        <Title level={2}>Luxury Hotels</Title>
        <Text type="secondary">
          Discover our collection of premium hotels worldwide
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
        {hotels.length > 0 ? (
          <>
            <Title level={4} style={{ marginBottom: "20px" }}>
              {hotels.length} Hotel{hotels.length !== 1 ? "s" : ""} Available
            </Title>
            {hotels.map(renderHotelCard)}
          </>
        ) : (
          <Card>
            <Empty
              description="No hotels found"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button type="primary" onClick={fetchAllHotels}>
                Refresh
              </Button>
            </Empty>
          </Card>
        )}
      </div>
    </HotelsContainer>
  );
};

export default HotelsPage;
