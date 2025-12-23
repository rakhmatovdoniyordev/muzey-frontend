import { Form, Input, Button, Typography, message } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { login } from "../../contex/authSlice";
import { useNavigate } from "react-router";
import { useLogin } from "../../hooks/useCategoryandBuildings";

interface LoginValues {
  email: string;
  password: string;
}

const { Title } = Typography;

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { mutate: performLogin, isPending } = useLogin();

  const onFinish = (values: LoginValues) => {
    performLogin(values, {
      onSuccess: (data) => {
        dispatch(login(data));

        message.success("Muvaffaqiyatli kirish!");
        navigate("/"); // Redirect to dashboard
      },
      onError: (error: any) => {
        if (error.response?.status === 401) {
          message.error("Email yoki parol noto‘g‘ri");
        }
      },
    });
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
          width: 400,
          padding: 32,
          backgroundColor: "#fff",
          borderRadius: 8,
          boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
        }}
      >
        <Title
          level={3}
          style={{ textAlign: "center", marginBottom: 24, color: "#001529" }}
        >
          Tizimga Kirish
        </Title>
        <Form
          name="login"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          style={{ maxWidth: 300, margin: "0 auto" }}
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: "Iltimos, email manzilingizni kiriting!",
              },
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Email"
              name="email"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: "Iltimos, parolni kiriting!" }]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: "rgba(0,0,0,.25)" }} />}
              placeholder="Parol"
              style={{ borderRadius: 4 }}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isPending}
              style={{
                width: "100%",
                borderRadius: 4,
                backgroundColor: "#1890ff",
                borderColor: "#1890ff",
              }}
            >
              Kirish
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
