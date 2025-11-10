import React from "react";
import { Layout, Row, Col, Typography, Space } from "antd";
import { ShopOutlined } from "@ant-design/icons";
import { motion } from "framer-motion";
import styled from "styled-components";
import { useUIStore } from "../../store";
import { useResponsive } from "../../utils/responsive";
import { lightTheme, darkTheme, media } from "../../styles/theme";

const { Content } = Layout;
const { Title, Text } = Typography;

const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: ${(props) =>
    props.theme === "dark"
      ? "linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)"
      : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"};
`;

const AuthContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})`
  background: ${(props) =>
    props.theme === "dark" ? darkTheme.surface : lightTheme.surface};
  border-radius: 16px;
  padding: ${(props) => (props.isMobile ? "20px" : "32px")};
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid
    ${(props) =>
      props.theme === "dark" ? darkTheme.border : "rgba(255, 255, 255, 0.2)"};
  width: 100%;
  max-width: ${(props) => (props.isMobile ? "100%" : "480px")};
  min-height: ${(props) => (props.isMobile ? "auto" : "500px")};
  max-height: none;
  overflow: visible;

  ${media.sm} {
    margin: 16px;
    padding: 20px;
    max-width: calc(100% - 32px);
  }
`;

const BrandSection = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})`
  text-align: center;
  margin-bottom: ${(props) => (props.isMobile ? "20px" : "24px")};
  color: ${(props) =>
    props.theme === "dark" ? darkTheme.primary : lightTheme.primary};

  .ant-typography {
    margin-bottom: ${(props) => (props.isMobile ? "8px" : "12px")} !important;
  }
`;

const FeatureSection = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== "isMobile",
})`
  color: white;
  padding: ${(props) => (props.isMobile ? "20px" : "40px")};
  display: flex;
  flex-direction: column;
  justify-content: center;
  min-height: 100vh;
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 16px;
  padding: 12px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
`;

const FeatureIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
  font-size: 16px;
`;

const AuthLayout = ({ children }) => {
  const { theme } = useUIStore();
  const { isMobile, isTablet } = useResponsive();

  const features = [
    {
      icon: "🏨",
      title: "Premium Hotels",
      description: "Access to luxury hotels worldwide",
    },
    {
      icon: "⚡",
      title: "Instant Booking",
      description: "Quick and secure booking process",
    },
    {
      icon: "🎯",
      title: "Smart Recommendations",
      description: "AI-powered suggestions for you",
    },
    {
      icon: "🔐",
      title: "Secure Payments",
      description: "Protected transactions guaranteed",
    },
  ];

  return (
    <StyledLayout theme={theme}>
      <Content>
        <Row style={{ minHeight: "100vh" }}>
          {/* Auth Form Section */}
          <Col xs={24} lg={12}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                padding: isMobile ? "16px" : "24px",
              }}
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                style={{ width: "100%", maxWidth: "480px" }}
              >
                <AuthContainer theme={theme} isMobile={isMobile}>
                  <BrandSection theme={theme} isMobile={isMobile}>
                    <motion.div
                      initial={{ scale: 0.9 }}
                      animate={{ scale: 1 }}
                      transition={{
                        delay: 0.1,
                        type: "spring",
                        stiffness: 200,
                      }}
                    >
                      <ShopOutlined
                        style={{
                          fontSize: isMobile ? "36px" : "42px",
                          marginBottom: isMobile ? "12px" : "16px",
                        }}
                      />
                      <Title
                        level={isMobile ? 3 : 2}
                        style={{ margin: 0, color: "inherit" }}
                      >
                        LuxeStay
                      </Title>
                      <Text
                        type="secondary"
                        style={{ fontSize: isMobile ? "14px" : "16px" }}
                      >
                        Your gateway to luxury accommodations
                      </Text>
                    </motion.div>
                  </BrandSection>

                  {children}
                </AuthContainer>
              </motion.div>
            </div>
          </Col>

          {/* Features Section - Hidden on mobile and tablet */}
          {!isMobile && !isTablet && (
            <Col lg={12}>
              <FeatureSection isMobile={isMobile}>
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <div style={{ marginBottom: "32px" }}>
                    <Title
                      level={2}
                      style={{ color: "white", marginBottom: "12px" }}
                    >
                      Experience Luxury Like Never Before
                    </Title>
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 0.8)",
                        fontSize: "16px",
                      }}
                    >
                      Join thousands of travelers who trust LuxeStay.
                    </Text>
                  </div>

                  <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: "100%" }}
                  >
                    {features.map((feature, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <FeatureItem>
                          <FeatureIcon>{feature.icon}</FeatureIcon>
                          <div>
                            <Title
                              level={5}
                              style={{ color: "white", margin: "0 0 4px 0" }}
                            >
                              {feature.title}
                            </Title>
                            <Text
                              style={{
                                color: "rgba(255, 255, 255, 0.8)",
                                fontSize: "14px",
                              }}
                            >
                              {feature.description}
                            </Text>
                          </div>
                        </FeatureItem>
                      </motion.div>
                    ))}
                  </Space>

                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                    style={{ marginTop: "32px", textAlign: "center" }}
                  >
                    <Text
                      style={{
                        color: "rgba(255, 255, 255, 0.6)",
                        fontSize: "14px",
                      }}
                    >
                      "LuxeStay transformed how I book hotels!"
                    </Text>
                    <br />
                    <Text
                      strong
                      style={{
                        color: "white",
                        marginTop: "4px",
                        display: "block",
                        fontSize: "14px",
                      }}
                    >
                      - Sarah Johnson
                    </Text>
                  </motion.div>
                </motion.div>
              </FeatureSection>
            </Col>
          )}
        </Row>
      </Content>
    </StyledLayout>
  );
};

export default AuthLayout;
