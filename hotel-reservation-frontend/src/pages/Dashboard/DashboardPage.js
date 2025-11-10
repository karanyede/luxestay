import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Card,
  Statistic,
  Typography,
  Space,
  Button,
  List,
  Avatar,
  Badge,
  Progress,
  Calendar,
  Timeline,
  Rate,
  Tag,
} from "antd";
import {
  CalendarOutlined,
  ClockCircleOutlined,
  StarOutlined,
  TrophyOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
  EyeOutlined,
  HeartOutlined,
  GiftOutlined,
  ShopOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useAuthStore, useReservationsStore } from "../../store";
import dayjs from "dayjs";

const { Title, Text, Paragraph } = Typography;

const DashboardPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { reservations, fetchUserReservations } = useReservationsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      if (user?.id) {
        await fetchUserReservations(user.id);
      }
      setLoading(false);
    };
    loadData();
  }, [user?.id, fetchUserReservations]);

  // Mock data for demo purposes
  const bookingTrends = [
    { month: "Jan", bookings: 4 },
    { month: "Feb", bookings: 3 },
    { month: "Mar", bookings: 6 },
    { month: "Apr", bookings: 8 },
    { month: "May", bookings: 5 },
    { month: "Jun", bookings: 7 },
  ];

  const roomTypeData = [
    { name: "Suite", value: 40, color: "#1890ff" },
    { name: "Deluxe", value: 35, color: "#52c41a" },
    { name: "Standard", value: 25, color: "#faad14" },
  ];

  const upcomingReservations = reservations
    .filter((r) => dayjs(r.check_in).isAfter(dayjs()))
    .slice(0, 3);

  const recentActivities = [
    {
      title: "Booked Presidential Suite",
      description: "Ritz-Carlton, New York",
      time: "2 hours ago",
      icon: <ShopOutlined style={{ color: "#1890ff" }} />,
    },
    {
      title: "Review submitted",
      description: "Rated 5 stars for Grand Hotel",
      time: "1 day ago",
      icon: <StarOutlined style={{ color: "#faad14" }} />,
    },
    {
      title: "Profile updated",
      description: "Added phone number",
      time: "3 days ago",
      icon: <UserOutlined style={{ color: "#52c41a" }} />,
    },
  ];

  const loyaltyPoints = 2450;
  const nextTierPoints = 3000;
  const progressToNextTier = (loyaltyPoints / nextTierPoints) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: "24px" }}>
        <Title level={2} style={{ margin: 0 }}>
          Welcome back,{" "}
          {user?.user_metadata?.full_name || user?.email?.split("@")[0]}! 👋
        </Title>
        <Text type="secondary">
          Here's what's happening with your bookings and account
        </Text>
      </div>

      {/* Quick Stats */}
      <Row gutter={[24, 24]} style={{ marginBottom: "32px" }}>
        <Col xs={12} sm={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <Statistic
                title="Total Bookings"
                value={reservations.length}
                prefix={<CalendarOutlined />}
                valueStyle={{ color: "#3f8600" }}
                suffix={<ArrowUpOutlined />}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} sm={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <Statistic
                title="Upcoming Trips"
                value={upcomingReservations.length}
                prefix={<ClockCircleOutlined />}
                valueStyle={{ color: "#1890ff" }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} sm={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <Statistic
                title="Loyalty Points"
                value={loyaltyPoints}
                prefix={<TrophyOutlined />}
                valueStyle={{ color: "#722ed1" }}
              />
            </Card>
          </motion.div>
        </Col>
        <Col xs={12} sm={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <Statistic
                title="Average Rating"
                value={4.8}
                precision={1}
                prefix={<StarOutlined />}
                valueStyle={{ color: "#faad14" }}
              />
            </Card>
          </motion.div>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* Booking Trends Chart */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card
              title="Booking Trends"
              extra={<Button type="link">View All</Button>}
            >
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={bookingTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="bookings"
                    stroke="#1890ff"
                    strokeWidth={3}
                    dot={{ fill: "#1890ff", strokeWidth: 2, r: 4 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Room Type Preferences */}
        <Col xs={24} lg={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card title="Room Preferences">
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={roomTypeData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    dataKey="value"
                    label={({ name, percent }) =>
                      `${name} ${(percent * 100).toFixed(0)}%`
                    }
                  >
                    {roomTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Card>
          </motion.div>
        </Col>

        {/* Upcoming Reservations */}
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card
              title="Upcoming Reservations"
              extra={
                <Button
                  type="primary"
                  onClick={() => navigate("/reservations")}
                >
                  View All
                </Button>
              }
            >
              {upcomingReservations.length > 0 ? (
                <List
                  itemLayout="horizontal"
                  dataSource={upcomingReservations}
                  renderItem={(item, index) => (
                    <List.Item
                      actions={[
                        <Button type="link" icon={<EyeOutlined />}>
                          View
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Avatar
                            size={64}
                            src={`https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&h=100&fit=crop&crop=center&auto=format&q=60`}
                            style={{ borderRadius: "8px" }}
                          />
                        }
                        title={
                          <Space>
                            <Text strong>
                              {item.rooms?.hotels?.name || "Hotel Name"}
                            </Text>
                            <Tag color="blue">Room {item.rooms?.number}</Tag>
                          </Space>
                        }
                        description={
                          <Space direction="vertical" size="small">
                            <Text type="secondary">
                              <CalendarOutlined />{" "}
                              {dayjs(item.check_in).format("MMM DD")} -{" "}
                              {dayjs(item.check_out).format("MMM DD, YYYY")}
                            </Text>
                            <Text type="secondary">
                              {item.rooms?.hotels?.location || "Location"}
                            </Text>
                          </Space>
                        }
                      />
                    </List.Item>
                  )}
                />
              ) : (
                <div style={{ textAlign: "center", padding: "40px 0" }}>
                  <CalendarOutlined
                    style={{
                      fontSize: "48px",
                      color: "#d9d9d9",
                      marginBottom: "16px",
                    }}
                  />
                  <Title level={4} type="secondary">
                    No upcoming reservations
                  </Title>
                  <Paragraph type="secondary">
                    Ready for your next adventure? Browse our amazing hotels and
                    book your stay.
                  </Paragraph>
                  <Button
                    type="primary"
                    size="large"
                    onClick={() => navigate("/rooms")}
                  >
                    Browse Hotels
                  </Button>
                </div>
              )}
            </Card>
          </motion.div>
        </Col>

        {/* Loyalty Program & Recent Activities */}
        <Col xs={24} lg={8}>
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            {/* Loyalty Program */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              <Card title="Loyalty Program" extra={<GiftOutlined />}>
                <Space direction="vertical" style={{ width: "100%" }}>
                  <div style={{ textAlign: "center" }}>
                    <Title level={3} style={{ margin: 0, color: "#722ed1" }}>
                      {loyaltyPoints}
                    </Title>
                    <Text type="secondary">Current Points</Text>
                  </div>
                  <Progress
                    percent={progressToNextTier}
                    strokeColor="#722ed1"
                    trailColor="#f0f0f0"
                  />
                  <Text type="secondary" style={{ fontSize: "12px" }}>
                    {nextTierPoints - loyaltyPoints} points to Gold status
                  </Text>
                  <Button type="primary" ghost block>
                    Redeem Points
                  </Button>
                </Space>
              </Card>
            </motion.div>

            {/* Recent Activities */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
            >
              <Card title="Recent Activities">
                <Timeline
                  items={recentActivities.map((activity) => ({
                    dot: activity.icon,
                    children: (
                      <div>
                        <Text strong>{activity.title}</Text>
                        <br />
                        <Text type="secondary">{activity.description}</Text>
                        <br />
                        <Text type="secondary" style={{ fontSize: "12px" }}>
                          {activity.time}
                        </Text>
                      </div>
                    ),
                  }))}
                />
              </Card>
            </motion.div>
          </Space>
        </Col>
      </Row>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        style={{ marginTop: "32px" }}
      >
        <Card title="Quick Actions">
          <Row gutter={[16, 16]}>
            <Col xs={12} sm={6}>
              <Button
                type="primary"
                block
                size="large"
                icon={<ShopOutlined />}
                onClick={() => navigate("/rooms")}
              >
                Book Now
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button
                block
                size="large"
                icon={<CalendarOutlined />}
                onClick={() => navigate("/reservations")}
              >
                My Trips
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button
                block
                size="large"
                icon={<HeartOutlined />}
                onClick={() => navigate("/favorites")}
              >
                Favorites
              </Button>
            </Col>
            <Col xs={12} sm={6}>
              <Button
                block
                size="large"
                icon={<UserOutlined />}
                onClick={() => navigate("/profile")}
              >
                Profile
              </Button>
            </Col>
          </Row>
        </Card>
      </motion.div>
    </motion.div>
  );
};

export default DashboardPage;
