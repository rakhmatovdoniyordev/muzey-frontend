// DOCUMENT filename="CategoryTable.tsx"
import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { DeleteOutlined } from '@ant-design/icons';
import { useCategoriesAsosiy, useDeleteCategory } from "../../../hooks/useCategoryandBuildings";


const CategoryTable: React.FC = () => {
  const { data: dataSource = [] } = useCategoriesAsosiy();
  const { mutate: deleteCategory } = useDeleteCategory();

  const handleDelete = (id: number) => {
    deleteCategory(id);
  };

  const columns: ColumnsType<any> = [
    {
      title: 'Rim',
      dataIndex: 'categoryNumber',
      key: 'categoryNumber',
      width: '20%',
      align: 'center' as const,
    },
    {
      title: 'Nomi',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Amallar',
      key: 'action',
      width: '15%',
      align: 'center' as const,
      render: (_, record) => (
        <Popconfirm
          title=" Ushbu qatorni o'chirmoqchimisiz?"
          onConfirm={() => handleDelete(record.id)}
          okText="Ha"
          cancelText="Yo'q"
        >
          <Button
            danger
            type="text"
            icon={<DeleteOutlined />}
            className="text-red-500 hover:text-red-700"
          />
        </Popconfirm>
      ),
    },
  ];

  return (
      <div className="w-full shadow-sm rounded-lg overflow-hidden">
        <Table
          columns={columns}
          dataSource={dataSource}
          pagination={false}
          bordered
          className="ant-table-custom"
        />
      </div>
  );
};

export default CategoryTable;