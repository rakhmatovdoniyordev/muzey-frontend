import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../api/index";

export interface ItemObject {
  id: number;
  name: string;
  material: string;
  category_id: number;
  period: number;
  price: string;
  status: string;
  fondType: string;
  building_id: number;
  sub_category_id?: number;
  subCategory: string;
  bino: number;
  qavat: number;
  xona: number;
  vitrina: number;
  polka: number;
  infoName: string;
  description: string;
  floor: number;
  room: number;
  showcase: number;
  category?: {
    categoryNumber: string;
    description: string;
    name: string;
  };
}
export interface SubCategory {
  id: number;
  name: string;
  category_id: number;
  status: { key: string; name: string }[];
  infoName: string | number;
  description: string;
}

export interface Building {
  id: number;
  category_id: number;
  name: string;
  floors: number;
  rooms: number;
  showcase: number;
  polkas: number;
}

export interface Category {
  id: number;
  name: string;
  infoName: string;
  categoryNumber: string;
  statusType: string;
  description: string;
  authorName: string;
  moved: number;
  status: string;
  objs: ItemObject[];
  bulds: Building[];
  subcategories: SubCategory[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse<T> {
  statusCode: number;
  message: string;
  data: T;
}

// Asosiy categories (main categories)
export const useCategoriesAsosiy = () => {
  return useQuery({
    queryKey: ["asosiy-categories"],
    queryFn: async () => {
      const { data } = await request.get<ApiResponse<Category[]>>("/category");
      return data.data;
    },
  });
};

// Sub-categories
export const useCategories = () => {
  return useQuery({
    queryKey: ["sub-categories"],
    queryFn: async () => {
      const { data } = await request.get<ApiResponse<SubCategory[]>>(
        "/sub-category"
      );
      return data.data;
    },
  });
};

// Item objects
export const useItemObjects = () => {
  return useQuery({
    queryKey: ["item-objects"],
    queryFn: async () => {
      const { data } = await request.get<ApiResponse<ItemObject[]>>(
        "/item-objects"
      );
      return data.data || [];
    },
  });
};

// Buildings
export const useBuildings = () => {
  return useQuery({
    queryKey: ["buildings"],
    queryFn: async () => {
      const { data } = await request.get<ApiResponse<Building[]>>("/building");
      return data.data || [];
    },
  });
};

// All Buildings (alias if needed)
export const useAllBuildings = useBuildings;

// Single building by ID
export const useBuildingId = (id: number | null) => {
  return useQuery({
    queryKey: ["building", id],
    queryFn: async () => {
      if (!id) throw new Error("Invalid building ID");
      const { data } = await request.get<ApiResponse<Building>>(
        `/building/${id}`
      );
      return data.data;
    },
    enabled: !!id && id > 0,
  });
};

// Create item object
export const useCreateItemObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<ItemObject, "id">) => {
      const { data } = await request.post<ApiResponse<ItemObject>>(
        "/item-objects",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-objects"] });
      queryClient.invalidateQueries({ queryKey: ["asosiy-categories"] });
    },
  });
};

// Update item object
export const useUpdateItemObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<ItemObject>;
    }) => {
      const { data } = await request.patch<ApiResponse<ItemObject>>(
        `/item-objects/${id}`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-objects"] });
      queryClient.invalidateQueries({ queryKey: ["asosiy-categories"] });
    },
  });
};

// Delete item object
export const useDeleteItemObject = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await request.delete(`/item-objects/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["item-objects"] });
      queryClient.invalidateQueries({ queryKey: ["asosiy-categories"] });
    },
  });
};

// Create building
export const useCreateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Building, "id">) => {
      const { data } = await request.post<ApiResponse<Building>>(
        "/building",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
    },
  });
};

// Update building
export const useUpdateBuilding = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Building>;
    }) => {
      const { data } = await request.patch<ApiResponse<Building>>(
        `/building/${id}`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["buildings"] });
      queryClient.invalidateQueries({ queryKey: ["asosiy-categories"] });
    },
  });
};

// Update category
export const useUpdateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Category>;
    }) => {
      const { data } = await request.patch<ApiResponse<Category>>(
        `/category/${id}`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asosiy-categories"] });
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
  });
};

// Create category
export const useCreateCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (
      payload: Omit<
        Category,
        "id" | "objs" | "bulds" | "subcategories" | "createdAt" | "updatedAt"
      >
    ) => {
      const { data } = await request.post<ApiResponse<Category>>(
        "/category",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asosiy-categories"] });
    },
  });
};

/* Ushbu backend va Frontend kodlarini taxlil qil va menga Frontendda aniq va tiniq ishlaydigan kod yozib ber Joylashuv ma'lumotlari create bo'layotgan vaqti buildingdagi idni olib uni locationga building_id ga jo'natishi kerak. Iltimos barcha kodni ko'rib chiqib Menga aniq ishlaydigan kodni yozib berishingni hohlayman.*/

// Delete category
export const useDeleteCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await request.delete(`/category/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["asosiy-categories"] });
    },
  });
};

// Create sub-category
export const useCreateSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      category_id: number;
      status: { key: string }[];
    }) => {
      const { data } = await request.post<ApiResponse<SubCategory>>(
        "/sub-category",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
      queryClient.invalidateQueries({ queryKey: ["asosiy-categories"] });
    },
  });
};

// Delete sub-category
export const useDeleteSubCategory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      await request.delete(`/sub-category/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sub-categories"] });
    },
  });
};

export interface Location {
  id: number;
  category_id: number;
  building_id: number;
  floor: number;
  room: number;
  showcase: number;
  polka: number;
  infoName?: string;
  description?: string;
  reasonForTransfer?: string;
}

// Locations
export const useLocations = () => {
  return useQuery({
    queryKey: ["locations"],
    queryFn: async () => {
      const { data } = await request.get<ApiResponse<Location[]>>("/location");
      return data.data || [];
    },
  });
};

// Location by category_id (find from all locations)
export const useLocationByCategory = (categoryId: number | null) => {
  const { data: locations = [] } = useLocations();
  return useQuery({
    queryKey: ["location-by-category", categoryId],
    queryFn: () =>
      locations.find((loc) => loc.category_id === categoryId) || null,
    enabled: !!categoryId && !!locations.length,
  });
};

// Create location
export const useCreateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<Location, "id">) => {
      const { data } = await request.post<ApiResponse<Location>>(
        "/location",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};

// Update location
export const useUpdateLocation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: Partial<Location>;
    }) => {
      const { data } = await request.patch<ApiResponse<Location>>(
        `/location/${id}`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["locations"] });
    },
  });
};
