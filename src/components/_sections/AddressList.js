"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import useAxios from "@/hooks/useAxios";
import AddressCard from "@/components/_cards/AddressCard";
import AddressAddEditDialog from "@/components/_dialogs/AddressAddEditDialog";
import LoadingDots from "../common/LoadingDots";
import { showToast } from "@/components/_ui/toast-utils";

function AddressList({ mode = "view", onSelect }) {
  const { request: apiRequest, loading } = useAxios();
  const [addresses, setAddresses] = useState([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selectedId, setSelectedId] = useState(null);

  const fetchAddresses = async () => {
    const { data } = await apiRequest({
      method: "GET",
      url: "/user/get-all-address",
      authRequired: true,
    });
    if (data?.data?.addresses) setAddresses(data.data.addresses);
  };

  const handleSave = async (formData) => {
    const method = editing ? "PUT" : "POST";
    const url = editing ? `/user/update-address` : "/user/add-address";

    const { data, error } = await apiRequest({
      method,
      url,
      authRequired: true,
      payload: editing ? { ...formData, addressId: editing._id } : formData,
    });

    if (error || (!data?.success && data?.status !== 200 && data?.status !== 201)) {
      showToast("error", error || data?.message || "Failed to save address.");
      return;
    }

    showToast("success", editing ? "Address updated successfully" : "Address added successfully");
    const savedAddress = data?.data;
    if (savedAddress) {
      if (editing) {
        setAddresses((prev) =>
          prev.map((a) => (a._id === editing._id ? savedAddress : a))
        );
      } else {
        setAddresses((prev) => [...prev, savedAddress]);
        if (mode === "selectable" && savedAddress._id) {
          setSelectedId(savedAddress._id);
          onSelect?.(savedAddress);
        }
      }
    }
    await fetchAddresses();

    setOpen(false);
    setEditing(null);
  };

  const handleDelete = async (id) => {
    const prev = [...addresses];
    setAddresses(addresses.filter((a) => a._id !== id));

    const { data, error } = await apiRequest({
      method: "PUT",
      url: `/user/delete-address?addressId=${id}`,
      payload: {},
      authRequired: true,
    });

    if (error || !data?.success) {
      setAddresses(prev);
      showToast("error", error || data?.message || "Failed to delete address.");
    } else {
      showToast("success", "Address deleted successfully");
      await fetchAddresses();
    }
  };

  const handleSelect = (addr) => {
    if (mode === "selectable") {
      setSelectedId(addr._id);
      onSelect?.(addr);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  if (loading)
    return <LoadingDots dotClassName="bg-brand" title="Loading addresses..." />;

  return (
    <div className="space-y-4">
      {/* Address Cards */}
      <div className="space-y-3">
        {addresses.map((addr) => (
          <div
            key={addr._id}
            onClick={() => handleSelect(addr)}
            className={`transition cursor-pointer ${
              mode === "selectable"
                ? selectedId === addr._id
                  ? "ring-2 ring-brand"
                  : "hover:ring-1 hover:ring-gray-300"
                : ""
            }`}
          >
            <AddressCard
              address={addr}
              onEdit={() => {
                setEditing(addr);
                setOpen(true);
              }}
              onDelete={() => handleDelete(addr._id)}
            />
          </div>
        ))}
      </div>

      {/* Add New */}
      <Button
        onClick={() => {
          setEditing(null);
          setOpen(true);
        }}
        variant="outline"
        className="w-full h-10 rounded-none border-dashed border-gray-300 text-xs font-semibold tracking-wide uppercase text-gray-500 hover:border-brand hover:text-brand transition-colors flex items-center justify-center gap-1.5"
      >
        <Plus size={14} /> Add New Address
      </Button>

      {/* Add/Edit Modal */}
      <AddressAddEditDialog
        open={open}
        setOpen={setOpen}
        initialForm={editing || null}
        onSave={handleSave}
        loading={loading}
        editing={editing}
      />
    </div>
  );
}

export default AddressList;
