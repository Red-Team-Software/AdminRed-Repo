import { useState, useEffect } from "react";
import { Item } from "@/types";
import { Product } from "../products/use-products";
import CategoryInstanceApi from "@/api/category-instance-api";
import ProductInstanceApi from "@/api/product-instance-api";
import BundleInstanceApi from "@/api/bundle-instance-api";

import { CategoryDetails } from "./use-category-details";
import { Bundle } from "../bundles/use-bundles";

export interface CategoryFormValues {
	id?: string;
	name: string;
	image: File;
	products: Item[];
	bundles: Item[];
	// categories: Item[];
}

const useCategoryForm = (idCategory?: string) => {
	const [initialCategory, setInitialCategory] = useState<CategoryFormValues>({
		name: "",
		image: new File([], ""),
		products: [],
		bundles: [],
	});

	const [originalCategory, setOriginalCategory] =
		useState<CategoryFormValues | null>(null);

	const ItemsTypeList: Item[] = [
		{ id: "1", name: "Products" },
		{ id: "2", name: "Bundles" },
	];

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [isError, setIsError] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [itemType, setItemType] = useState<Item>(ItemsTypeList[0]);
	const [itemsFetched, setItemsFetched] = useState<Item[]>([]);
	const [page, setPage] = useState<number>(1);

	const saveCategory = async (category: CategoryFormValues, id?: string) => {
		setIsLoading(true);
		setIsError(false);
		setError(null);

		const formData = new FormData();
		if (
			(originalCategory && originalCategory.name === category.name) ||
			!originalCategory
		) {
			formData.append("name", category.name);
		}

		if (category.image) {
			formData.append("image", category.image);
		}

		if (
			(originalCategory &&
				originalCategory.products.length !== category.products.length) ||
			!originalCategory
		) {
			category.products.forEach((product) => {
				formData.append("products", product.id);
			});
		}

		if (
			(originalCategory &&
				originalCategory.bundles.length !== category.bundles.length) ||
			!originalCategory
		) {
			category.bundles.forEach((bundle) => {
				formData.append("bundles", bundle.id);
			});
		}

		console.log(...formData);

		try {
			if (id) {
				const categoryInstanceApi = CategoryInstanceApi.getInstance();
				const response = await categoryInstanceApi.patch(
					`/update/${id}`,
					formData
				);
				console.log(response);
			} else {
				const categoryInstanceApi = CategoryInstanceApi.getInstance();
				const response = await categoryInstanceApi.post("/create", formData);
				console.log(response);
			}
		} catch (err: any) {
			console.log(err);
			setIsError(true);
			setError("Error saving category: " + err.response.data.message);
		} finally {
			setIsLoading(false);
		}
	};

	const _getCategoryToEdit = async (id: string) => {
		setIsLoading(true);
		setError(null);
		setIsError(false);
		try {
			const categoryInstanceApi = CategoryInstanceApi.getInstance();
			const response = await categoryInstanceApi.get<CategoryDetails>(`/${id}`);
			setInitialCategory({
				id: response.data.id,
				name: response.data.name,
				image: new File([], ""),
				products: response.data.products,
				bundles: response.data.bundles,
			});
			setOriginalCategory({
				id: response.data.id,
				name: response.data.name,
				image: new File([], ""),
				products: response.data.products,
				bundles: response.data.bundles,
			});
		} catch (err: any) {
			console.error(err);
			setError(err.message);
			setIsError(true);
		} finally {
			setIsLoading(false);
		}
	};

	function handlePage(p: number): void {
		if (p > 0 && p != page) {
			setPage(p);
			fetchItems(itemType.id);
		}
	}

	const fetchItems = async (itemId: string) => {
		setIsLoading(true);
		setError(null);
		setIsError(false);

		try {
			if (!itemType) {
				return;
			}
			if (itemId === "1") {
				const productInstanceApi = ProductInstanceApi.getInstance();
				const response = await productInstanceApi.get<Product[]>("/many", {
					params: {
						page,
						perPage: 7,
					},
				});

				const products: Item[] = response.data.map((product) => {
					return {
						id: product.id,
						name: product.name,
					};
				});
				// console.log(products);
				setItemsFetched(products);
			}
			if (itemId === "2") {
				const bundleInstanceApi = BundleInstanceApi.getInstance();
				const response = await bundleInstanceApi.get<Bundle[]>("/many", {
					params: {
						page,
						perPage: 7,
					},
				});

				const products: Item[] = response.data.map((product) => {
					return {
						id: product.id,
						name: product.name,
					};
				});
				setItemsFetched(products);
			}
		} catch (err: any) {
			console.error(err);
			setIsError(true);
			setError(err.message);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSelectedType = (itemId: string) => {
		const item = ItemsTypeList.find((item) => item.id === itemId);
		// console.log('Paso por aqui item:', item);
		if (item) {
			setItemType(item);
			setPage(1);
			fetchItems(itemId);
		}
	};

	useEffect(() => {
		const token = sessionStorage.getItem("token");
		if (!token) {
			setError("No token found");
			return;
		}
		if (idCategory) {
			_getCategoryToEdit(idCategory);
		}
	}, []);

	return {
		initialCategory,
		isFetching: isLoading,
		isErrorSaving: isError,
		errorSaving: error,
		saveCategoryApi: saveCategory,
		itemType,
		handleSelectedType,
		ItemsTypeList,
		itemsFetched,
		handlePage,
		page,
	};
};

export default useCategoryForm;
