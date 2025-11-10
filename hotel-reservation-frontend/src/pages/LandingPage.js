import React from "react";
import {
  Layout,
  Button,
  Typography,
  Row,
  Col,
  Card,
  Space,
  Statistic,
  Avatar,
  Rate,
  Input,
  Form,
  message,
} from "antd";
import {
  SearchOutlined,
  CalendarOutlined,
  SafetyOutlined,
  CrownOutlined,
  StarOutlined,
  UserOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const { Header, Content, Footer } = Layout;
const { Title, Text, Paragraph } = Typography;
const { Search } = Input;

const HeroSection = styled.section`
  background: linear-gradient(
      135deg,
      rgba(102, 126, 234, 0.9) 0%,
      rgba(118, 75, 162, 0.9) 100%
    ),
    url("https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3")
      center/cover;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-align: center;
  position: relative;
`;

const HeroContent = styled.div`
  max-width: 800px;
  padding: 0 20px;
  z-index: 2;
`;

const StyledHeader = styled(Header)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  width: 100%;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
`;

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 24px;
  font-weight: 700;
  color: #1890ff;
`;

const SearchCard = styled(Card)`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: none;
  border-radius: 16px;
  margin-top: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
`;

const FeatureCard = styled(Card)`
  height: 100%;
  border: none;
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
  }
`;

const StatsSection = styled.section`
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 80px 0;
`;

const TestimonialCard = styled(Card)`
  height: 100%;
  border: none;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);

  .ant-card-body {
    padding: 32px;
  }
`;

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <SearchOutlined style={{ fontSize: "48px", color: "#1890ff" }} />,
      title: "Smart Search",
      description:
        "AI-powered search that finds the perfect room based on your preferences and budget.",
    },
    {
      icon: <CalendarOutlined style={{ fontSize: "48px", color: "#52c41a" }} />,
      title: "Instant Booking",
      description:
        "Book your room in seconds with our streamlined booking process and real-time availability.",
    },
    {
      icon: <SafetyOutlined style={{ fontSize: "48px", color: "#faad14" }} />,
      title: "Secure Payments",
      description:
        "Your payments are protected with bank-level security and multiple payment options.",
    },
    {
      icon: <CrownOutlined style={{ fontSize: "48px", color: "#722ed1" }} />,
      title: "Premium Service",
      description:
        "24/7 customer support and concierge services to make your stay unforgettable.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Business Traveler",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
      rating: 5,
      comment:
        "LuxeStay has revolutionized how I book business trips. The interface is intuitive and the recommendations are spot-on!",
    },
    {
      name: "Mike Chen",
      role: "Vacation Enthusiast",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
      rating: 5,
      comment:
        "Found the most amazing boutique hotels through LuxeStay. The personalized service and attention to detail is incredible.",
    },
    {
      name: "Emily Davis",
      role: "Digital Nomad",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
      rating: 5,
      comment:
        "As someone who travels constantly, LuxeStay has become my go-to platform. Reliable, fast, and always delivers quality.",
    },
  ];

  const handleSearch = (value) => {
    if (value.trim()) {
      navigate(`/rooms?search=${encodeURIComponent(value)}`);
    } else {
      navigate("/rooms");
    }
  };

  return (
    <Layout>
      <StyledHeader>
        <Logo>
          <CrownOutlined />
          LuxeStay
        </Logo>
        <Space>
          <Button type="text" onClick={() => navigate("/rooms")}>
            Browse Hotels
          </Button>
          <Button type="text" onClick={() => navigate("/login")}>
            Sign In
          </Button>
          <Button type="primary" onClick={() => navigate("/register")}>
            Get Started
          </Button>
        </Space>
      </StyledHeader>

      <Content>
        {/* Hero Section */}
        <HeroSection>
          <HeroContent>
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <Title
                level={1}
                style={{
                  color: "white",
                  fontSize: "clamp(2rem, 6vw, 4rem)",
                  marginBottom: "24px",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                }}
              >
                Discover Your Perfect Stay
              </Title>
              <Paragraph
                style={{
                  color: "rgba(255,255,255,0.9)",
                  fontSize: "20px",
                  marginBottom: "40px",
                }}
              >
                Experience luxury accommodations worldwide with personalized
                service and unmatched comfort.
              </Paragraph>

              <SearchCard>
                <Search
                  placeholder="Search destinations, hotels, or experiences..."
                  size="large"
                  onSearch={handleSearch}
                  style={{ fontSize: "16px" }}
                  enterButton={
                    <Button
                      type="primary"
                      size="large"
                      icon={<SearchOutlined />}
                    >
                      Search
                    </Button>
                  }
                />
              </SearchCard>
            </motion.div>
          </HeroContent>
        </HeroSection>

        {/* Features Section */}
        <section style={{ padding: "100px 50px", background: "#fafafa" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Title
                level={2}
                style={{ textAlign: "center", marginBottom: "60px" }}
              >
                Why Choose LuxeStay?
              </Title>
            </motion.div>

            <Row gutter={[32, 32]}>
              {features.map((feature, index) => (
                <Col xs={24} sm={12} lg={6} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <FeatureCard>
                      <div style={{ textAlign: "center", padding: "20px" }}>
                        <div style={{ marginBottom: "24px" }}>
                          {feature.icon}
                        </div>
                        <Title level={4} style={{ marginBottom: "16px" }}>
                          {feature.title}
                        </Title>
                        <Text type="secondary">{feature.description}</Text>
                      </div>
                    </FeatureCard>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* Stats Section */}
        <StatsSection>
          <div
            style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 50px" }}
          >
            <Row gutter={[32, 32]} justify="center">
              <Col xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: true }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>
                        Hotels Worldwide
                      </span>
                    }
                    value={25000}
                    suffix="+"
                    valueStyle={{
                      color: "white",
                      fontSize: "36px",
                      fontWeight: "bold",
                    }}
                  />
                </motion.div>
              </Col>
              <Col xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  viewport={{ once: true }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>
                        Happy Customers
                      </span>
                    }
                    value={500000}
                    suffix="+"
                    valueStyle={{
                      color: "white",
                      fontSize: "36px",
                      fontWeight: "bold",
                    }}
                  />
                </motion.div>
              </Col>
              <Col xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>
                        Countries
                      </span>
                    }
                    value={150}
                    suffix="+"
                    valueStyle={{
                      color: "white",
                      fontSize: "36px",
                      fontWeight: "bold",
                    }}
                  />
                </motion.div>
              </Col>
              <Col xs={12} sm={6}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  viewport={{ once: true }}
                >
                  <Statistic
                    title={
                      <span style={{ color: "rgba(255,255,255,0.8)" }}>
                        Satisfaction Rate
                      </span>
                    }
                    value={98}
                    suffix="%"
                    valueStyle={{
                      color: "white",
                      fontSize: "36px",
                      fontWeight: "bold",
                    }}
                  />
                </motion.div>
              </Col>
            </Row>
          </div>
        </StatsSection>

        {/* Testimonials Section */}
        <section style={{ padding: "100px 50px", background: "white" }}>
          <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Title
                level={2}
                style={{ textAlign: "center", marginBottom: "60px" }}
              >
                What Our Guests Say
              </Title>
            </motion.div>

            <Row gutter={[32, 32]}>
              {testimonials.map((testimonial, index) => (
                <Col xs={24} md={8} key={index}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <TestimonialCard>
                      <div
                        style={{ textAlign: "center", marginBottom: "24px" }}
                      >
                        <Avatar size={80} src={testimonial.avatar} />
                        <Title
                          level={4}
                          style={{ marginTop: "16px", marginBottom: "4px" }}
                        >
                          {testimonial.name}
                        </Title>
                        <Text type="secondary">{testimonial.role}</Text>
                        <div style={{ marginTop: "8px" }}>
                          <Rate disabled defaultValue={testimonial.rating} />
                        </div>
                      </div>
                      <Text italic>"{testimonial.comment}"</Text>
                    </TestimonialCard>
                  </motion.div>
                </Col>
              ))}
            </Row>
          </div>
        </section>

        {/* CTA Section */}
        <section
          style={{
            padding: "80px 50px",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            textAlign: "center",
            color: "white",
          }}
        >
          <div style={{ maxWidth: "800px", margin: "0 auto" }}>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Title level={2} style={{ color: "white", marginBottom: "24px" }}>
                Ready to Experience Luxury?
              </Title>
              <Paragraph
                style={{
                  fontSize: "18px",
                  marginBottom: "40px",
                  color: "rgba(255,255,255,0.9)",
                }}
              >
                Join millions of travelers who trust LuxeStay for their
                accommodation needs. Start your journey today.
              </Paragraph>
              <Space size="large">
                <Button
                  size="large"
                  type="primary"
                  style={{
                    background: "white",
                    color: "#1890ff",
                    border: "none",
                  }}
                  onClick={() => navigate("/register")}
                  icon={<ArrowRightOutlined />}
                >
                  Get Started Free
                </Button>
                <Button size="large" ghost onClick={() => navigate("/rooms")}>
                  Browse Hotels
                </Button>
              </Space>
            </motion.div>
          </div>
        </section>
      </Content>

      <Footer
        style={{
          background: "#001529",
          color: "white",
          padding: "50px 50px 20px",
        }}
      >
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Row gutter={[32, 32]}>
            <Col xs={24} sm={6}>
              <Title
                level={4}
                style={{ color: "#1890ff", marginBottom: "20px" }}
              >
                LuxeStay
              </Title>
              <Paragraph style={{ color: "rgba(255,255,255,0.7)" }}>
                Your gateway to luxury accommodations worldwide. Experience the
                finest hotels with personalized service.
              </Paragraph>
            </Col>
            <Col xs={12} sm={6}>
              <Title level={5} style={{ color: "white" }}>
                Company
              </Title>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  About Us
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Careers
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Press
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Blog
                </a>
              </div>
            </Col>
            <Col xs={12} sm={6}>
              <Title level={5} style={{ color: "white" }}>
                Support
              </Title>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Help Center
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Contact Us
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Safety
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Terms
                </a>
              </div>
            </Col>
            <Col xs={24} sm={6}>
              <Title level={5} style={{ color: "white" }}>
                Connect
              </Title>
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Twitter
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Facebook
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  Instagram
                </a>
                <a href="#" style={{ color: "rgba(255,255,255,0.7)" }}>
                  LinkedIn
                </a>
              </div>
            </Col>
          </Row>
          <div
            style={{
              textAlign: "center",
              marginTop: "40px",
              paddingTop: "20px",
              borderTop: "1px solid rgba(255,255,255,0.1)",
              color: "rgba(255,255,255,0.7)",
            }}
          >
            <Text style={{ color: "inherit" }}>
              © 2025 LuxeStay. All rights reserved. Made with ❤️ for travelers
              worldwide.
            </Text>
          </div>
        </div>
      </Footer>
    </Layout>
  );
};

export default LandingPage;
