import React, { useState } from "react";
import { Layout, Menu, Button, Dropdown, Avatar, Space, message } from "antd";
import {
  MenuOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  HomeOutlined,
  CalendarOutlined,
  BookOutlined,
  DashboardOutlined,
} from "@ant-design/icons";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { useAuth } from "../../hooks/useAuth";
import { useResponsive } from "../../utils/responsive";
import { useUIStore } from "../../store";
import { lightTheme, darkTheme } from "../../styles/theme";

const { Header, Content, Sider } = Layout;

// Styled Components
const StyledLayout = styled(Layout)`
  min-height: 100vh;
  background: ${(props) =>
    props.theme === "dark" ? darkTheme.background : lightTheme.background};
`;

const StyledHeader = styled(Header)`
  padding: 0 24px;
  background: ${(props) =>
    props.theme === "dark" ? darkTheme.surface : lightTheme.surface};
  border-bottom: 1px solid
    ${(props) =>
      props.theme === "dark" ? darkTheme.border : lightTheme.border};
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 100;

  @media (max-width: 768px) {
    padding: 0 16px;
  }
`;

const Logo = styled.div`
  color: ${(props) =>
    props.theme === "dark" ? darkTheme.primary : lightTheme.primary};
  font-size: 24px;
  font-weight: bold;
  cursor: pointer;

  @media (max-width: 768px) {
    font-size: 20px;
  }
`;

const StyledSider = styled(Sider)`
  background: ${(props) =>
    props.theme === "dark" ? darkTheme.surface : lightTheme.surface};
  border-right: 1px solid
    ${(props) =>
      props.theme === "dark" ? darkTheme.border : lightTheme.border};

  .ant-layout-sider-trigger {
    background: ${(props) =>
      props.theme === "dark" ? darkTheme.border : lightTheme.border};
    color: ${(props) =>
      props.theme === "dark" ? darkTheme.text : lightTheme.text};
  }
`;

const StyledContent = styled(Content)`
  background: ${(props) =>
    props.theme === "dark" ? darkTheme.background : lightTheme.background};
  min-height: calc(100vh - 64px);
  padding: 24px;

  @media (max-width: 768px) {
    padding: 16px;
  }
`;

const UserSection = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const MainLayout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const { user, signOut, getUserDisplayName } = useAuth();
  const { isMobile } = useResponsive();
  const { isDark } = useUIStore();
  const location = useLocation();
  const navigate = useNavigate();

  const theme = isDark ? "dark" : "light";

  // Menu items
  const menuItems = [
    {
      key: "/dashboard",
      icon: <DashboardOutlined />,
      label: <Link to="/dashboard">Dashboard</Link>,
    },
    {
      key: "/hotels",
      icon: <HomeOutlined />,
      label: <Link to="/hotels">Hotels</Link>,
    },
    {
      key: "/rooms",
      icon: <HomeOutlined />,
      label: <Link to="/rooms">Browse Rooms</Link>,
    },
    {
      key: "/booking/advanced",
      icon: <CalendarOutlined />,
      label: <Link to="/booking/advanced">Book Now</Link>,
    },
    {
      key: "/my-bookings",
      icon: <BookOutlined />,
      label: <Link to="/my-bookings">My Bookings</Link>,
    },
  ];

  // User dropdown menu
  const userMenuItems = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Profile",
      onClick: () => navigate("/profile"),
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Settings",
    },
    {
      type: "divider",
    },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Logout",
      onClick: handleLogout,
    },
  ];

  async function handleLogout() {
    try {
      await signOut();
      message.success("Logged out successfully");
      navigate("/");
    } catch (error) {
      message.error("Failed to logout");
    }
  }

  const getSelectedKeys = () => {
    return [location.pathname];
  };

  if (isMobile) {
    return (
      <StyledLayout theme={theme}>
        <StyledHeader theme={theme}>
          <Logo theme={theme} onClick={() => navigate("/")}>
            LuxeStay
          </Logo>

          <UserSection>
            {user && (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button type="text" style={{ padding: 0, height: "auto" }}>
                  <Space>
                    <Avatar
                      size="small"
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: isDark
                          ? darkTheme.primary
                          : lightTheme.primary,
                      }}
                    />
                  </Space>
                </Button>
              </Dropdown>
            )}
          </UserSection>
        </StyledHeader>

        <StyledContent theme={theme}>{children}</StyledContent>
      </StyledLayout>
    );
  }

  return (
    <StyledLayout theme={theme}>
      <StyledSider
        theme={theme}
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        collapsedWidth="80"
      >
        <div style={{ padding: "16px", textAlign: "center" }}>
          <Logo theme={theme} onClick={() => navigate("/")}>
            {collapsed ? "LS" : "LuxeStay"}
          </Logo>
        </div>

        <Menu
          mode="inline"
          selectedKeys={getSelectedKeys()}
          items={menuItems}
          theme={theme}
          style={{
            background: "transparent",
            border: "none",
          }}
        />
      </StyledSider>

      <Layout>
        <StyledHeader theme={theme}>
          <div style={{ flex: 1 }} />

          <UserSection>
            {user && (
              <Dropdown
                menu={{ items: userMenuItems }}
                placement="bottomRight"
                trigger={["click"]}
              >
                <Button type="text">
                  <Space>
                    <Avatar
                      icon={<UserOutlined />}
                      style={{
                        backgroundColor: isDark
                          ? darkTheme.primary
                          : lightTheme.primary,
                      }}
                    />
                    <span
                      style={{
                        color: isDark ? darkTheme.text : lightTheme.text,
                      }}
                    >
                      {getUserDisplayName()}
                    </span>
                  </Space>
                </Button>
              </Dropdown>
            )}
          </UserSection>
        </StyledHeader>

        <StyledContent theme={theme}>{children}</StyledContent>
      </Layout>
    </StyledLayout>
  );
};

export default MainLayout;
