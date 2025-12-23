import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { request } from "../api/index";
import { AxiosError } from "axios";

export interface ItemObject {
  id: number;
  name: string;
  material: string;
  category_id: number;
  period: number;
  price: string;
  status: string;
  fondType: string;
  sub_category_id?: number;
  subCategory: string;
  description: string;
  statusCategory?: string;
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
  category_id: number | string;
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

interface ApiErrorResponse {
  statusCode: number;
  message: string;
  error: string;
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
  itemObject_id: number;
  building_id: number;
  floor: number;
  room: number;
  showcase: number;
  polka: number;
  infoName?: string;
  description?: string;
  reasonForTransfer?: string;
}

export interface History {
  id: number;
  name: string;
  data: {
    key: string;
    itemName: string;
    info: {
      reason: string;
      description: string;
      date: string;
      fromLocation: {
        buildingId: number;
        buildingName: string;
        floor: number;
        room: number;
        showcase: number;
        shelf: number;
      } | null;
      toLocation: {
        buildingId: number;
        buildingName: string;
        floor: number;
        room: number;
        showcase: number;
        shelf: number;
      };
      responsiblePerson: string;
    };
  };
  createAt: string;
  updateAt: string;
}

export interface HistoryRequest {
  name: string;
  data: {
    key: string;
    itemName: string;
    info: {
      reason: string;
      description: string;
      date: string;
      fromLocation: {
        buildingId: number;
        buildingName: string;
        floor: number;
        room: number;
        showcase: number;
        shelf: number;
      } | null;
      toLocation: {
        buildingId: number;
        buildingName: string;
        floor: number;
        room: number;
        showcase: number;
        shelf: number;
      };
      responsiblePerson: string;
    };
  };
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

// Location by itemObject_id (find from all locations)
export const useLocationByItem = (itemId: number | null) => {
  const { data: locations = [] } = useLocations();

  return useQuery({
    queryKey: ["location-by-item", itemId],
    queryFn: () => {
      const result =
        locations.find(
          (loc) => loc.itemObject_id === itemId || loc.id === itemId
        ) || null;
      return result;
    },
    enabled: !!itemId,
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
      queryClient.invalidateQueries({ queryKey: ["location-by-item"] });
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
      queryClient.invalidateQueries({ queryKey: ["location-by-item"] });
    },
  });
};

// Create history record
export const useCreateHistory = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Omit<HistoryRequest, "id">) => {
      const { data } = await request.post<ApiResponse<History>>(
        "/history",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["histories"] });
    },
  });
};

// Get histories
export const useHistory = () => {
  return useQuery({
    queryKey: ["histories"],
    queryFn: async () => {
      const { data } = await request.get<ApiResponse<History[]>>("/history");
      return data.data || [];
    },
  });
};

interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: string;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  admin: AdminUser;
  token: string;
  password: string;
}

// Get all admins
export const useAdmins = () => {
  return useQuery({
    queryKey: ["admins"],
    queryFn: async () => {
      const { data } = await request.get<ApiResponse<AdminUser[]>>("/admin");
      return data.data;
    },
  });
};

// Create admin
export const useCreateAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: {
      email: string;
      password: string;
      name: string;
    }) => {
      const { data } = await request.post<ApiResponse<AdminUser>>(
        "/admin",
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

// Update admin password
export const useUpdateAdminPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      payload,
    }: {
      id: number;
      payload: { confirmPassword: string; password: string };
    }) => {
      const { data } = await request.patch<ApiResponse<AdminUser>>(
        `/admin/${id}/password`,
        payload
      );
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

// Delete admin
export const useDeleteAdmin = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await request.delete<ApiResponse<void>>(`/admin/${id}`);
      return data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admins"] });
    },
  });
};

//auth hooks
export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation<
    LoginResponse,
    AxiosError<ApiErrorResponse>,
    { email: string; password: string }
  >({
    mutationFn: async (payload) => {
      const { data } = await request.post<ApiResponse<LoginResponse>>(
        "/auth/login",
        payload
      );
      return data.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["auth"], data);
      localStorage.setItem("token", data.token);
    },
    onError: (error) => {
      console.error(
        "Login failed:",
        error.response?.data?.message || error.message
      );
    },
  });
};
