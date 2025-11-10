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
  Progress,
} from "antd";
import {
  UserOutlined,
  LockOutlined,
  GoogleOutlined,
  EyeInvisibleOutlined,
  EyeTwoTone,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuthStore } from "../../store";

const { Title, Text } = Typography;

const RegisterPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [passwordStrength, setPasswordStrength] = useState(0);
  const navigate = useNavigate();
  const { signUp } = useAuthStore();

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 25;
    if (/[a-z]/.test(password)) strength += 25;
    if (/[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    return strength;
  };

  const handlePasswordChange = (e) => {
    const password = e.target.value;
    setPasswordStrength(calculatePasswordStrength(password));
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength < 50) return "#ff4d4f";
    if (passwordStrength < 75) return "#faad14";
    return "#52c41a";
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength < 25) return "Very Weak";
    if (passwordStrength < 50) return "Weak";
    if (passwordStrength < 75) return "Medium";
    return "Strong";
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    setError(null);

    console.log("📝 Registration form submitted:", values);

    try {
      const { confirmPassword, terms, ...userData } = values;

      const result = await signUp(values.email, values.password, {
        fullName: values.fullName,
        phone: values.phone,
      });

      if (result.success) {
        console.log("📝 Registration successful, redirecting to rooms page");
        navigate("/rooms", {
          state: {
            message: "Registration successful! Welcome to LuxeStay.",
          },
        });
      } else {
        console.error("📝 Registration failed:", result.error);
        setError(result.error || "Registration failed. Please try again.");
      }
    } catch (err) {
      console.error("📝 Registration error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = () => {
    // Google OAuth signup will be handled by Supabase
    console.log("Google signup clicked");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div style={{ marginBottom: "32px", textAlign: "center" }}>
        <Title level={3} style={{ margin: "0 0 8px 0" }}>
          Create Your Account
        </Title>
        <Text type="secondary">
          Join thousands of travelers who trust LuxeStay
        </Text>
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ marginBottom: "24px" }}
        >
          <Alert
            message={error}
            type="error"
            showIcon
            closable
            onClose={() => setError(null)}
          />
        </motion.div>
      )}

      <Form
        form={form}
        name="register"
        onFinish={handleSubmit}
        layout="vertical"
        size="large"
        requiredMark={false}
      >
        <Form.Item
          name="fullName"
          label="Full Name"
          rules={[
            { required: true, message: "Please enter your full name" },
            { min: 2, message: "Name must be at least 2 characters" },
          ]}
        >
          <Input
            prefix={<UserOutlined />}
            placeholder="Enter your full name"
            autoComplete="name"
          />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email Address"
          rules={[
            { required: true, message: "Please enter your email address" },
            { type: "email", message: "Please enter a valid email address" },
          ]}
        >
          <Input
            prefix={<MailOutlined />}
            placeholder="Enter your email"
            autoComplete="email"
          />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number (Optional)"
          rules={[
            {
              pattern: /^[\+]?[1-9][\d]{0,15}$/,
              message: "Please enter a valid phone number",
            },
          ]}
        >
          <Input
            prefix={<PhoneOutlined />}
            placeholder="Enter your phone number"
            autoComplete="tel"
          />
        </Form.Item>

        <Form.Item
          name="password"
          label="Password"
          rules={[
            { required: true, message: "Please enter your password" },
            { min: 8, message: "Password must be at least 8 characters" },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Create a strong password"
            autoComplete="new-password"
            onChange={handlePasswordChange}
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        {passwordStrength > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            style={{ marginBottom: "16px" }}
          >
            <Progress
              percent={passwordStrength}
              strokeColor={getPasswordStrengthColor()}
              showInfo={false}
              size="small"
            />
            <Text type="secondary" style={{ fontSize: "12px" }}>
              Password strength:{" "}
              <span style={{ color: getPasswordStrengthColor() }}>
                {getPasswordStrengthText()}
              </span>
            </Text>
          </motion.div>
        )}

        <Form.Item
          name="confirmPassword"
          label="Confirm Password"
          dependencies={["password"]}
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Passwords do not match"));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Confirm your password"
            autoComplete="new-password"
            iconRender={(visible) =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
          />
        </Form.Item>

        <Form.Item
          name="terms"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(
                      new Error("Please accept the terms and conditions")
                    ),
            },
          ]}
        >
          <Checkbox>
            I agree to the{" "}
            <Link to="/terms" style={{ color: "#1890ff" }}>
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" style={{ color: "#1890ff" }}>
              Privacy Policy
            </Link>
          </Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: "16px" }}>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            block
            size="large"
            style={{
              height: "48px",
              fontSize: "16px",
              fontWeight: "500",
            }}
          >
            {loading ? "Creating Account..." : "Create Account"}
          </Button>
        </Form.Item>
      </Form>

      <Divider plain>
        <Text type="secondary">or sign up with</Text>
      </Divider>

      <Button
        icon={<GoogleOutlined />}
        onClick={handleGoogleSignUp}
        block
        size="large"
        style={{
          height: "48px",
          fontSize: "16px",
          marginBottom: "24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "8px",
        }}
      >
        Continue with Google
      </Button>

      <div style={{ textAlign: "center" }}>
        <Text type="secondary">
          Already have an account?{" "}
          <Link to="/login" style={{ color: "#1890ff", fontWeight: "500" }}>
            Sign in here
          </Link>
        </Text>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          marginTop: "32px",
          padding: "16px",
          background: "#f5f5f5",
          borderRadius: "8px",
          textAlign: "center",
        }}
      >
        <Space direction="vertical" size="small">
          <Text type="secondary" style={{ fontSize: "12px" }}>
            🎉 <strong>Welcome Bonus:</strong> Get 10% off your first booking!
          </Text>
          <Text type="secondary" style={{ fontSize: "12px" }}>
            🔒 Your data is protected with enterprise-grade security
          </Text>
        </Space>
      </motion.div>
    </motion.div>
  );
};

export default RegisterPage;
