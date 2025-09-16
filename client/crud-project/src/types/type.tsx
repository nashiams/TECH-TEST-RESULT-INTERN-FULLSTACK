export interface Product {
  id: number;
  name: string;
  userId: number;
  image: string;
  description?: string;
}

export interface Pagination {
  currentPage: number;
  totalPages: number;
  totalProducts: number;
  limit: number;
}

export interface ProductsResponse {
  products: Product[];
  pagination: Pagination;
}

export interface ProductForm {
  name: string;
  description: string;
}

export interface AddEditFormProps {
  formData: ProductForm;
  onInputChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  onSubmit: (formData: ProductForm) => void;
  onCancel: () => void;
  isEditMode: boolean;
  loading: boolean;
  error: string | null;
}

export interface AuthFormProps {
  isLogin: boolean;
  onSuccess: (data: any) => void;
}

export interface DetailContentProps {
  product: Product;
  currentUserId: number | null;
  productId: string | undefined;
}

export interface PaginationComponentProps {
  pagination: Pagination;
  onPageChange: (page: number) => void;
}

export interface ProductCardProps {
  product: Product;
  onDelete: (id: number) => void;
  currentUserId: number | null;
}
