import { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Input,
  Tag,
  Form,
  Input as AntdInput,
  Select,
  Alert,
} from "antd";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import PageMeta from "../../components/common/PageMeta";
import {
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import {
  useAdmins,
  useCreateAdmin,
  useUpdateAdminPassword,
  useDeleteAdmin,
} from "../../hooks/useCategoryandBuildings";
import { Modal } from "../../components/ui/modal";

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

const roleOptions = [
  { value: "Admin", label: "Admin" },
  { value: "Superadmin", label: "Superadmin" },
];

export default function AdminManagement() {
  const navigate = useNavigate();
  const { data: admins = [], isLoading } = useAdmins();
  const { mutate: createAdmin } = useCreateAdmin();
  const { mutate: updateAdminPassword } = useUpdateAdminPassword();
  const { mutate: deleteAdmin } = useDeleteAdmin();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPasswordModalVisible, setIsPasswordModalVisible] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();
  const [passwordForm] = Form.useForm();

  const authState = useSelector((state: any) => state.auth);
  const currentUser = authState.user;

  const isSuperAdmin = currentUser?.role?.toLowerCase() === "superadmin";

  useEffect(() => {
    if (currentUser && !isSuperAdmin) {
      navigate("/");
    }
  }, [currentUser, isSuperAdmin, navigate]);

  const filteredAdmins = useMemo(() => {
    return admins.filter(
      (admin) =>
        admin.name.toLowerCase().includes(searchText.toLowerCase()) ||
        admin.email.toLowerCase().includes(searchText.toLowerCase()) ||
        admin.role.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [admins, searchText]);

  const columns: ColumnsType<AdminUser> = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a, b) => a.id - b.id,
    },
    {
      title: "Foydalanuvchi",
      key: "user",
      render: (_, record) => (
        <div>
          <div className="font-medium">{record.name}</div>
          <div className="text-xs text-gray-500">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Rol",
      dataIndex: "role",
      key: "role",
      render: (role) => {
        const color = role?.toLowerCase() === "superadmin" ? "red" : "blue";
        return (
          <Tag color={color}>
            {role?.toLowerCase() === "superadmin" ? "Super Admin" : "Admin"}
          </Tag>
        );
      },
      filters: [
        { text: "Admin", value: "Admin" },
        { text: "Superadmin", value: "Superadmin" },
      ],
      onFilter: (value, record) => record.role === value,
    },
    {
      title: "Yaratilgan sana",
      dataIndex: "createdAt",
      key: "createdAt",
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      render: (date) => new Date(date).toLocaleDateString("uz-UZ"),
    },
    {
      title: "Amallar",
      key: "actions",
      render: (_, record) => (
        <Space size="middle">
          <div className="flex flex-col gap-2">
            <Button
              type="link"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
              disabled={
                !isSuperAdmin ||
                (record.role?.toLowerCase() === "superadmin" &&
                  record.id !== currentUser?.id)
              }
            >
              Tahrirlash
            </Button>
            <Button
              type="link"
              onClick={() => handlePasswordChange(record)}
              disabled={
                !isSuperAdmin ||
                (record.role?.toLowerCase() === "superadmin" &&
                  record.id !== currentUser?.id)
              }
            >
              Parolni o'zgartirish
            </Button>
          </div>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={
              !isSuperAdmin || record.role?.toLowerCase() === "superadmin"
            }
          >
            O'chirish
          </Button>
        </Space>
      ),
    },
  ];

  const handleEdit = (admin: AdminUser) => {
    setEditingAdmin(admin);
    form.setFieldsValue(admin);
    setIsModalVisible(true);
  };

  const handlePasswordChange = (admin: AdminUser) => {
    setEditingAdmin(admin);
    passwordForm.resetFields();
    setIsPasswordModalVisible(true);
  };

  const handleDelete = (id: number) => {
    if (!isSuperAdmin) {
      message.error("Faqat Super Adminlar adminlarni o'chirishi mumkin!");
      return;
    }

    Modal.confirm({
      title: "Adminni o'chirish",
      content: "Haqiqatan ham bu adminni o'chirmoqchimisiz?",
      okText: "Ha",
      okType: "danger",
      cancelText: "Yo'q",
      onOk: () => {
        deleteAdmin(id, {
          onSuccess: () => {
            message.success("Admin muvaffaqiyatli o'chirildi!");
          },
          onError: (error: any) => {
            message.error(
              "Adminni o'chirishda xatolik: " +
                (error.message || "Noma'lum xatolik")
            );
          },
        });
      },
    });
  };

  const handleAddAdmin = () => {
    if (!isSuperAdmin) {
      message.error("Faqat Super Adminlar admin yaratishi mumkin!");
      return;
    }

    setEditingAdmin(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleModalOk = () => {
    form
      .validateFields()
      .then((values) => {
        if (editingAdmin) {
          message.info(
            "Umumiy ma'lumotlarni yangilash hozircha mavjud emas. Faqat parolni yangilashingiz mumkin."
          );
          setIsModalVisible(false);
        } else {
          createAdmin(values, {
            onSuccess: () => {
              message.success("Yangi admin qo'shildi!");
              setIsModalVisible(false);
            },
            onError: (error: any) => {
              message.error(
                "Admin qo'shishda xatolik: " +
                  (error.message || "Noma'lum xatolik")
              );
            },
          });
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handleModalCancel = () => {
    setIsModalVisible(false);
  };

  const handlePasswordModalOk = () => {
    passwordForm
      .validateFields()
      .then((values) => {
        if (editingAdmin) {
          updateAdminPassword(
            { id: editingAdmin.id, payload: values },
            {
              onSuccess: () => {
                message.success("Admin paroli yangilandi!");
                setIsPasswordModalVisible(false);
              },
              onError: (error: any) => {
                message.error(
                  "Admin ma'lumotlarini yangilashda xatolik: " +
                    (error.message || "Noma'lum xatolik")
                );
              },
            }
          );
        }
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  const handlePasswordModalCancel = () => {
    setIsPasswordModalVisible(false);
  };

  return (
    <>
      <PageMeta
        title="Muzey | Admin Boshqaruvi"
        description="Admin foydalanuvchilarni boshqarish"
      />
      <PageBreadcrumb pageTitle="Admin Boshqaruvi" />

      {!isSuperAdmin && currentUser && (
        <Alert
          message="Kirish rad etildi"
          description="Bu sahifaga faqat Superadmin foydalanuvchilar kirishi mumkin."
          type="error"
          showIcon
          className="mb-6"
        />
      )}

      {isSuperAdmin && (
        <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
          <div className="mb-6 flex items-center justify-between gap-4">
            <Input
              placeholder="Qidirish..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="w-full sm:w-64 ant-input dark-input"
            />
            {isSuperAdmin && (
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAddAdmin}
              >
                Yangi Admin
              </Button>
            )}
          </div>

          {!isSuperAdmin && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded text-yellow-800">
              Eslatma: Admin yaratish va tahrirlash faqat Super Adminlar uchun
              mavjud.
            </div>
          )}

          <Table
            dataSource={filteredAdmins}
            columns={columns}
            loading={isLoading}
            rowKey="id"
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              pageSizeOptions: ["10", "20", "50"],
            }}
            scroll={{ x: 800 }}
          />
        </div>
      )}

      <Modal
        title={editingAdmin ? "Adminni tahrirlash" : "Yangi admin qo'shish"}
        isOpen={isModalVisible}
        onClose={handleModalCancel}
        className="max-w-md p-6"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Ism"
            rules={[{ required: true, message: "Ismni kiriting!" }]}
          >
            <AntdInput className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Emailni kiriting!" },
              { type: "email", message: "To'g'ri email kiriting!" },
            ]}
          >
            <AntdInput className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </Form.Item>

          {!editingAdmin && (
            <Form.Item
              name="password"
              label="Parol"
              rules={[{ required: true, message: "Parolni kiriting!" }]}
            >
              <AntdInput.Password className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Rol"
            rules={[{ required: true, message: "Rolni tanlang!" }]}
          >
            <Select
              options={roleOptions}
              className="dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </Form.Item>
        </Form>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handleModalCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handleModalOk}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            {editingAdmin ? "Yangilash" : "Qo'shish"}
          </button>
        </div>
      </Modal>

      <Modal
        title="Admin parolini o'zgartirish"
        isOpen={isPasswordModalVisible}
        onClose={handlePasswordModalCancel}
        className="max-w-md p-6"
      >
        <Form form={passwordForm} layout="vertical">
          <Form.Item
            name="password"
            label="Yangi parol"
            rules={[{ required: true, message: "Parolni kiriting!" }]}
          >
            <AntdInput.Password className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Parolni tasdiqlang"
            rules={[
              { required: true, message: "Parolni tasdiqlang!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Parollar mos emas!"));
                },
              }),
            ]}
          >
            <AntdInput.Password className="dark:bg-gray-700 dark:border-gray-600 dark:text-white" />
          </Form.Item>
        </Form>
        <div className="flex justify-end gap-2 mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
          <button
            type="button"
            onClick={handlePasswordModalCancel}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:ring-2 focus:outline-none focus:ring-gray-200 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
          >
            Bekor qilish
          </button>
          <button
            type="button"
            onClick={handlePasswordModalOk}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:ring-2 focus:outline-none focus:ring-blue-500 dark:bg-blue-600 dark:hover:bg-blue-700"
          >
            Yangilash
          </button>
        </div>
      </Modal>
    </>
  );
}
