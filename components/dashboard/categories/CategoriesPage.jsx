"use client";

import { useState } from "react";
import useFetch from "../../../hooks/useFetch";
import { Plus, Pencil, Trash2, Tag } from "lucide-react";
// import { LIMIT } from "../../../lib/utils";
// import Pagination from "../../ui/Pagination";
import CategoryModal from "./CategoryModal";
import DeleteCategoryModal from "./DeleteCategoryModal";
import { useAuth } from "../../../hooks/useAuth";

const TYPE_STYLES = {
  income: "bg-green-100 text-[#0b6b3a] border-green-200",
  expense: "bg-red-100 text-[#c1121f] border-red-200",
  other: "bg-gray-100 text-gray-600 border-gray-200",
};

function TypeBadge({ type }) {
  const classes =
    TYPE_STYLES[type?.toLowerCase()] ??
    "bg-gray-100 text-gray-600 border-gray-200";
  return (
    <span
      className={`inline-block rounded-full border px-2.5 py-1 text-[10px] font-bold tracking-widest uppercase ${classes}`}
    >
      {type ?? "—"}
    </span>
  );
}

export default function CategoriesPage() {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editCategory, setEditCategory] = useState(null);
  const [deleteCategory, setDeleteCategory] = useState(null);
  // const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const {
    data: categoryData,
    isLoading,
    isError,
  } = useFetch("categories", "/categories");
  const categories = categoryData?.data ?? [];
  // const totalCount = categoryData?.data?.length ?? 0;
  // const totalPages = Math.ceil(totalCount / LIMIT);

  // const handlePageChange = (page) => {
  //   setCurrentPage(page);
  //   window.scrollTo({ top: 0, behavior: "smooth" });
  // };

  return (
    <div className="font-body min-h-screen py-8">
      <div className="mx-auto">
        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-3xl leading-tight font-bold text-black">
              Categories
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organise your categories
            </p>
          </div>
          {user?.data?.role === "admin" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="from-green to-green-light inline-flex cursor-pointer items-center gap-2 rounded-xl bg-linear-to-r px-5 py-2.5 text-sm font-semibold whitespace-nowrap text-white shadow-md shadow-[#0b6b3a35] transition-all duration-200 hover:-translate-y-px hover:opacity-90"
            >
              <Plus size={16} />
              Add Category
            </button>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
            <div className="border-t-green h-8 w-8 animate-spin rounded-full border-[3px] border-gray-200" />
            <p className="text-sm text-gray-400">Loading categories…</p>
          </div>
        )}

        {/* Error */}
        {isError && (
          <div className="flex items-center justify-center rounded-2xl border border-red-100 bg-red-50 py-16">
            <p className="text-red text-sm font-medium">
              Failed to load categories. Please try again.
            </p>
          </div>
        )}

        {/* Empty */}
        {!isLoading && !isError && categories.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl bg-white py-16 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50">
              <Tag size={22} className="text-green" />
            </div>
            <p className="text-sm text-gray-400">No categories found.</p>
            {user?.data?.role === "admin" && (
              <button
                onClick={() => setShowAddModal(true)}
                className="text-green mt-1 inline-flex cursor-pointer items-center gap-1.5 text-sm font-semibold hover:underline"
              >
                <Plus size={14} /> Add your first category
              </button>
            )}
          </div>
        )}

        {/* Table */}
        {!isLoading && !isError && categories.length > 0 && (
          <div className="w-full overflow-x-auto rounded-2xl bg-white shadow-sm">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  {[
                    "Name",
                    "Type",
                    ...(user?.data?.role === "admin" ? ["Actions"] : []),
                  ].map((col) => (
                    <th
                      key={col}
                      className="bg-white-soft border-b border-gray-100 px-5 py-3.5 text-left text-[11px] font-bold tracking-widest text-gray-400 uppercase"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.map((category, index) => (
                  <tr
                    key={category.id ?? index}
                    className={`border-b border-gray-50 transition-colors duration-150 hover:bg-green-50/40 ${
                      index % 2 === 0 ? "bg-white" : "bg-white-soft"
                    }`}
                  >
                    {/* Name */}
                    <td className="px-5 py-4 align-middle">
                      <p className="font-semibold text-black">
                        {category.name || "—"}
                      </p>
                    </td>

                    {/* Type */}
                    <td className="px-5 py-4 align-middle">
                      <TypeBadge type={category.type} />
                    </td>

                    {/* Actions — admin only */}
                    {user?.data?.role === "admin" && (
                      <td className="px-5 py-4 align-middle">
                        <div className="flex items-center gap-2">
                          {/* Edit */}
                          <button
                            onClick={() => setEditCategory(category)}
                            className="bg-green-light/20 text-green hover:bg-green-light/30 flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg transition-colors"
                            title="Edit category"
                          >
                            <Pencil size={14} />
                          </button>
                          {/* Delete */}
                          <button
                            onClick={() => setDeleteCategory(category)}
                            className="text-red flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg bg-red-50 transition-colors hover:bg-red-100"
                            title="Delete category"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {/* {!isLoading && !isError && categories.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalCount={totalCount}
            onChange={handlePageChange}
          />
        )} */}
      </div>

      {/* Modals */}
      {showAddModal && <CategoryModal onClose={() => setShowAddModal(false)} />}
      {editCategory && (
        <CategoryModal
          category={editCategory}
          onClose={() => setEditCategory(null)}
        />
      )}
      {deleteCategory && (
        <DeleteCategoryModal
          category={deleteCategory}
          onClose={() => setDeleteCategory(null)}
        />
      )}
    </div>
  );
}
