import React, { useState } from "react";
import {
  Form,
  Input,
  Button,
  Typography,
  Space,
  Divider,
  Alert,
  Checkbox,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store";
import { useResponsive } from "../../utils/responsive";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { signIn } = useAuthStore();
  const { isMobile } = useResponsive();

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    console.log("🔐 Login form submitted:", values);

    try {
      const result = await signIn(values.email, values.password);

      if (result.success) {
        console.log("🔐 Login successful, redirecting to rooms page");
        navigate("/rooms");
      } else {
        console.error("🔐 Login failed:", result.error);
        setError(result.error || "Login failed. Please try again.");
      }
    } catch (err) {
      console.error("🔐 Login error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    // Google OAuth login will be handled by Supabase
    console.log("Google login clicked");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div
        style={{
          marginBottom: isMobile ? "20px" : "24px",
          textAlign: "center",
        }}
      >
        <Title level={isMobile ? 4 : 3} style={{ margin: "0 0 6px 0" }}>
          Welcome Back
        </Title>
        <Text type="secondary" style={{ fontSize: isMobile ? "14px" : "16px" }}>
          Sign in to continue your luxury journey
        </Text>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginBottom: isMobile ? "16px" : "20px" }}
        >
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
            style={{ fontSize: isMobile ? "14px" : "16px" }}
          />
        </motion.div>
      )}

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        layout="vertical"
        size={isMobile ? "middle" : "large"}
        requiredMark={false}
      >
        <Form.Item
          name="email"
          label="Email Address"
          style={{ marginBottom: isMobile ? "16px" : "20px" }}
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter your email"
            autoComplete="email"
            style={{ height: isMobile ? "40px" : "48px" }}
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          style={{ marginBottom: isMobile ? "12px" : "16px" }}
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 6, message: "Password must be at least 6 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Enter your password"
            autoComplete="current-password"
            style={{ height: isMobile ? "40px" : "48px" }}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item style={{ marginBottom: isMobile ? "12px" : "16px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexWrap: isMobile ? "wrap" : "nowrap",
              gap: isMobile ? "8px" : "16px",
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ fontSize: isMobile ? "14px" : "16px" }}>
                Remember me
              </Checkbox>
            </Form.Item>
            <Link
              to="/forgot-password"
              style={{
                color: "#1890ff",
                fontSize: isMobile ? "14px" : "16px",
              }}
            >
              Forgot password?
            </Link>
          </div>
        </Form.Item>

        <Form.Item style={{ marginBottom: isMobile ? "12px" : "16px" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            style={{
              height: isMobile ? "40px" : "48px",
              fontSize: isMobile ? "14px" : "16px",
              fontWeight: "500",
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </Button>
        </Form.Item>
      </Form>

      <Divider plain style={{ margin: isMobile ? "16px 0" : "20px 0" }}>
        <Text type="secondary" style={{ fontSize: isMobile ? "12px" : "14px" }}>
          or continue with
        </Text>
      </Divider>

      <Button
        icon={<GoogleOutlined />}
        onClick={handleGoogleLogin}
        block
        style={{
          height: isMobile ? "40px" : "48px",
          fontSize: isMobile ? "14px" : "16px",
          marginBottom: isMobile ? "16px" : "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        Continue with Google
      </Button>

      <div
        style={{
          textAlign: "center",
          marginBottom: isMobile ? "12px" : "16px",
        }}
      >
        <Text type="secondary" style={{ fontSize: isMobile ? "14px" : "16px" }}>
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#1890ff",
              fontWeight: "500",
              fontSize: isMobile ? "14px" : "16px",
            }}
          >
            Sign up for free
          </Link>
        </Text>
      </div>

      {!isMobile && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            padding: "12px",
            background: "#f5f5f5",
            borderRadius: "6px",
            textAlign: "center",
          }}
        >
          <Text type="secondary" style={{ fontSize: "12px" }}>
            🔒 Your data is protected with enterprise-grade security
          </Text>
        </motion.div>
      )}
    </motion.div>
  );
};

export default LoginPage;
