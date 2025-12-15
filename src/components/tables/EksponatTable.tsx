import { useMemo, useState } from "react";
import {
  Table,
  Button,
  Space,
  message,
  Input,
  Popconfirm,
  Tooltip,
  TooltipProps,
} from "antd";
import {
  useItemObjects,
  useDeleteItemObject,
  useCategoriesAsosiy,
} from "../../hooks/useCategoryandBuildings";
import AddUpdateItemModal from "../ui/modal/AddandUpdateModal";
import ViewItemModal from "../ui/modal/EksponatSeeModal";
import LocationModal from "../ui/modal/LocationModal";
import AddBuildingModal from "../ui/modal/AddBuildingModal";
import type { ItemObject } from "../../hooks/useCategoryandBuildings";
import { EnvironmentOutlined } from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";

export default function EksponatTable() {
  const { data: items = [], isLoading } = useItemObjects();
  const { data: categories = [] } = useCategoriesAsosiy();
  console.log("Items", items);

  const { mutate: deleteItem } = useDeleteItemObject();
  console.log(items);

  // Filter categories by status - only show "Yangi" or "Kuchirildi"
  const filteredCategories = useMemo(() => {
    return categories.filter(
      (category) =>
        category.status === "Yangi" || category.status === "Kuchirildi"
    );
  }, [categories]);

  // Enhance items with category information
  const itemsWithCategoryInfo = useMemo(() => {
    return items.map((item) => {
      const category = filteredCategories.find(
        (cat) => cat.id === item.category_id
      );
      return {
        ...item,
        category: category || item.category,
      };
    });
  }, [items, filteredCategories]);

  const [modalState, setModalState] = useState({
    addUpdate: false,
    view: false,
    location: false,
    addBuilding: false,
  });

  const [selectedItem, setSelectedItem] = useState<ItemObject | undefined>();
  const [searchText, setSearchText] = useState("");

  const filteredItems = itemsWithCategoryInfo.filter(
    (item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.id.toString().includes(searchText)
  );

  const handleAddNew = () => {
    setSelectedItem(undefined);
    setModalState({ ...modalState, addUpdate: true });
  };

  const handleEdit = (item: ItemObject) => {
    setSelectedItem(item);
    setModalState({ ...modalState, addUpdate: true });
  };

  const handleView = (item: ItemObject) => {
    setSelectedItem(item);
    setModalState({ ...modalState, view: true });
  };

  const handleMove = (item: ItemObject) => {
    setSelectedItem(item);
    setModalState({ ...modalState, location: true });
  };

  const handleDelete = (id: number) => {
    deleteItem(id, {
      onSuccess: () => {
        message.success("Eksponat muvaffaqiyatli o'chirildi!");
      },
      onError: () => {
        message.error("O'chirishda xatolik!");
      },
    });
  };

  const EyeIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );

  const EditIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );

  const DeleteIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );

  const MoveIcon = () => <EnvironmentOutlined />;

  const PlusIcon = () => (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );

  const [arrow] = useState<"Show" | "Hide" | "Center">("Hide");

  const mergedArrow = useMemo<TooltipProps["arrow"]>(() => {
    if (arrow === "Hide") {
      return false;
    }

    if (arrow === "Show") {
      return true;
    }

    return {
      pointAtCenter: true,
    };
  }, [arrow]);

  const columns: ColumnsType<ItemObject> = [
    {
      title: "KP",
      dataIndex: "id",
      key: "id",
      width: 80,
      sorter: (a: ItemObject, b: ItemObject) => a.id - b.id,
      defaultSortOrder: "ascend",
      render: (id: number) => `KP-${id}`,
    },
    {
      title: "INV",
      key: "inv",
      width: 160,
      render: (_: any, record: ItemObject) => {
        const categoryNumber = record.category?.categoryNumber ?? "?";

        return (
          <span style={{ color: "#7c3aed" }}>
            INV-{categoryNumber}/01-{String(record.id).padStart(3, "0")}
          </span>
        );
      },
    },
    {
      title: "Nomi",
      dataIndex: "name",
      key: "name",
      render: (text: string) => <span style={{ fontWeight: 500 }}>{text}</span>,
    },
    {
      title: "Izoh",
      dataIndex: "description",
      key: "description",
      render: (_: any, record: ItemObject) => {
        const desc = record.category?.description ?? "...";

        return (
          <Tooltip title={desc} arrow={mergedArrow}>
            <span className="block max-w-[120px] truncate">{desc}</span>
          </Tooltip>
        );
      },
    },
    {
      title: "Holat",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <span
          style={{
            padding: "4px 8px",
            borderRadius: "4px",
            backgroundColor:
              status === "Qoniqarli"
                ? "#e6f7ff"
                : status === "Qoniqarsiz"
                ? "#fff7e6"
                : status === "Yaroqsiz"
                ? "#fff1f0"
                : "#f6f8fb",
            color:
              status === "Qoniqarli"
                ? "#1890ff"
                : status === "Qoniqarsiz"
                ? "#faad14"
                : status === "Yaroqsiz"
                ? "#ff4d4f"
                : "#1890ff",
            fontSize: "12px",
            fontWeight: 500,
          }}
        >
          {status}
        </span>
      ),
    },
    {
      title: "Amallar",
      key: "actions",
      width: 200,
      render: (_: any, record: ItemObject) => (
        <Space size="small">
          <Button
            type="text"
            size="small"
            onClick={() => handleView(record)}
            style={{ padding: 0, color: "#1890ff" }}
            title="Ko'rish"
          >
            <EyeIcon />
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => handleEdit(record)}
            style={{ padding: 0, color: "#52c41a" }}
            title="Tahrirlash"
          >
            <EditIcon />
          </Button>
          <Button
            type="text"
            size="small"
            onClick={() => handleMove(record)}
            style={{ padding: 0, color: "#9c27b0" }}
            title="Ko'chirish"
          >
            <MoveIcon />
          </Button>
          <Popconfirm
            title="O'chirishni tasdiqlang"
            description="Haqiqatan ham o'chirmoqchisiz?"
            onConfirm={() => handleDelete(record.id)}
            okText="Ha"
            cancelText="Yo'q"
          >
            <Button
              type="text"
              size="small"
              style={{ padding: 0, color: "#ff4d4f" }}
              title="O'chirish"
            >
              <DeleteIcon />
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 border rounded-xl shadow">
        <Input
          placeholder="Qidirish..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="h-[40px] w-full dark-input"
          prefix={
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              style={{ marginRight: "8px" }}
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M3.04175 9.37363C3.04175 5.87693 5.87711 3.04199 9.37508 3.04199C12.8731 3.04199 15.7084 5.87693 15.7084 9.37363C15.7084 12.8703 12.8731 15.7053 9.37508 15.7053C5.87711 15.7053 3.04175 12.8703 3.04175 9.37363ZM9.37508 1.54199C5.04902 1.54199 1.54175 5.04817 1.54175 9.37363C1.54175 13.6991 5.04902 17.2053 9.37508 17.2053C11.2674 17.2053 13.003 16.5344 14.357 15.4176L17.177 18.238C17.4699 18.5309 17.9448 18.5309 18.2377 18.238C18.5306 17.9451 18.5306 17.4703 18.2377 17.1774L15.418 14.3573C16.5365 13.0033 17.2084 11.2669 17.2084 9.37363C17.2084 5.04817 13.7011 1.54199 9.37508 1.54199Z"
                fill="currentColor"
              />
            </svg>
          }
        />
        <div className="flex gap-2">
          <Button
            type="default"
            onClick={() => setModalState({ ...modalState, addBuilding: true })}
            className="flex items-center gap-2 h-10"
            size="large"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Bino qo'shish
          </Button>
          <Button
            type="primary"
            onClick={handleAddNew}
            className="flex items-center gap-2 h-10"
            size="large"
          >
            <PlusIcon /> Yangi
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredItems.map((item) => ({ ...item, key: item.id }))}
        rowKey="id"
        loading={isLoading}
        size="middle"
        style={{ borderRadius: "8px", overflow: "hidden" }}
        className="border dark:border-gray-800 shadow"
      />

      <AddUpdateItemModal
        visible={modalState.addUpdate}
        onClose={() => setModalState({ ...modalState, addUpdate: false })}
        initialData={selectedItem}
      />

      <ViewItemModal
        visible={modalState.view}
        onClose={() => setModalState({ ...modalState, view: false })}
        data={selectedItem}
        onEdit={() => {
          setModalState({ ...modalState, view: false, addUpdate: true });
        }}
        onDelete={() => {
          handleDelete(selectedItem!.id);
          setModalState({ ...modalState, view: false });
        }}
        onMove={() => {
          setModalState({ ...modalState, view: false, location: true });
        }}
      />

      <LocationModal
        visible={modalState.location}
        onClose={() => setModalState({ ...modalState, location: false })}
        itemData={selectedItem}
      />

      <AddBuildingModal
        visible={modalState.addBuilding}
        onClose={() => setModalState({ ...modalState, addBuilding: false })}
        onCreated={() => {
          // Refresh buildings data if needed
        }}
      />
    </div>
  );
}
