import React from 'react';
import { Table, Button, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useCategories, useCategoriesAsosiy, useDeleteSubCategory } from "../../../hooks/useCategoryandBuildings";

const QismCategoryTable: React.FC = () => {
  const { data: mains = [] } = useCategoriesAsosiy();
  const { data: subs = [] } = useCategories();
  const { mutate: deleteSubCategory } = useDeleteSubCategory();

  const handleDelete = (id: number) => {
    deleteSubCategory(id);
  };

  return (
    <div>
      {mains.map((main) => {
        const groupSubs = subs
          .filter((sub) => sub.category_id === main.id)
          .map((sub) => ({
            ...sub,
            title: sub.status[0]?.key || 'Unknown',
          }));

        if (groupSubs.length === 0) return null;

        return (
          <div key={main.id} className="shadow-md rounded-t-lg overflow-hidden mb-4">
            <div className=" p-3 font-semibold text-gray-800 border dark:border-gray-700 rounded-t-xl dark:text-white/70">
              {main.categoryNumber} - {main.name}
            </div>
            <Table
              className='border dark:border-gray-700'
              columns={[
                {
                  title: '',
                  dataIndex: 'title',
                  key: 'title',
                  className: 'text-gray-700',
                },
                {
                  title: '',
                  key: 'action',
                  width: '10%',
                  align: 'center' as const,
                  render: (_, record) => (
                    <Popconfirm
                      title="Ushbu qatorni o'chirmoqchimisiz?"
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
              ]}
              dataSource={groupSubs}
              pagination={false}
              bordered={false}
              showHeader={false}
            />
          </div>
        );
      })}
    </div>
  );
};

export default QismCategoryTable;