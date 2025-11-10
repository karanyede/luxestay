import React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const AdminDashboard = () => {
  return (
    <div>
      <Title level={2}>Admin Dashboard</Title>
      <p>
        Admin panel with analytics and management tools will be implemented
        here.
      </p>
    </div>
  );
};

export default AdminDashboard;
