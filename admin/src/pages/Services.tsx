import { useState } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database, TablesInsert, TablesUpdate } from "../types/supabase";
import {
  Modal,
  Button,
  Group,
  TextInput,
  Textarea,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { showToast } from "../utils/toast";
import NotFoundErrorSection from "../components/NotFoundErrorSection";
import PageTitle from "../components/PageTitle";

type Service = Database["public"]["Tables"]["services"]["Row"];

const Services = () => {
  const userId = userStore((store) => store.id);
  const { services, loadServices } = userStore();
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) => (value ? null : "Service name is required"),
      description: (value) => (value ? null : "Description is required"),
    },
  });

  const handleAddService = async (values: typeof form.values) => {
    if (!userId) return;

    try {
      const adjustedValues: TablesInsert<"services"> = {
        name: values.name,
        description: values.description,
        user_id: userId,
      };

      const { error } = await supabaseClient
        .from("services")
        .insert([adjustedValues])
        .select();

      if (error) {
        console.log(`Error adding service: ${error}`);
        showToast("Failed to add Service record, please try again!", "error");
      } else {
        showToast("Service record added successfully!", "success");
        loadServices();
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast("Failed to add Service record, please try again!", "error");
      console.log(`Error in Add Service part: ${error}`);
    }
  };

  const handleEditService = async (values: typeof form.values) => {
    if (!userId || !editServiceId) return;

    try {
      const adjustedValues: TablesUpdate<"services"> = {
        name: values.name,
        description: values.description,
      };

      const { error } = await supabaseClient
        .from("services")
        .update(adjustedValues)
        .eq("id", editServiceId)
        .select();

      if (error) {
        showToast(
          "Failed to update Service record, please try again!",
          "error"
        );
        console.log(`Error editing service: ${error.message}`);
      } else {
        showToast("Service record updated successfully!", "updated");
        loadServices();
        setEditServiceId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast(
        "Failed to update Service record, please try again!",
        "error"
      );
      console.log(`Error in Edit Service part: ${error}`);
    }
  };

  const openAddServiceModal = () => {
    form.reset();
    setEditServiceId(null);
    setModalOpened(true);
  };

  const handleDeleteService = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from("services")
        .delete()
        .eq("id", id);

      if (error) {
        showToast(
          "Failed to delete Service record, please try again!",
          "error"
        );
        console.log(`Error deleting service: ${error.message}`);
      } else {
        showToast("Service record deleted successfully!", "deleted");
        loadServices();
      }
    } catch (error) {
      showToast(
        "Failed to delete Service record, please try again!",
        "error"
      );
      console.log(`Error in Delete Service part: ${error}`);
    }
  };

  const handleEditClick = (service: Service) => {
    form.setValues({
      name: service.name || "",
      description: service.description || "",
    });
    setEditServiceId(service.id.toString());
    setModalOpened(true);
  };

  const rows =
    services?.map((service) => (
      <Table.Tr key={service.id} className="text-center">
        <Table.Td className="px-4 truncate max-w-xs">{service.name}</Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {service.description}
        </Table.Td>
        <Table.Td className="px-4">
          <div className="flex justify-end mx-3">
            <FaEdit
              onClick={() => handleEditClick(service)}
              className="cursor-pointer text-blue-500 mx-3"
            />
            <FaTrashAlt
              onClick={() => handleDeleteService(service.id.toString())}
              className="cursor-pointer text-red-500 mx-3"
            />
          </div>
        </Table.Td>
      </Table.Tr>
    )) || [];

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Service Name</Table.Th>
      <Table.Th className="px-4 text-center">Description</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );

  return (
    <>
      <PageTitle title="Services" />

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editServiceId ? "Edit Service" : "Add Service"}
        centered
        size="lg"
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (editServiceId) {
              handleEditService(values);
            } else {
              handleAddService(values);
            }
          })}
          className="space-y-4"
        >
          <TextInput
          
            label="Service Name"
            placeholder="Enter service name"
            {...form.getInputProps("name")}
            withAsterisk
          />
          <Textarea
            label="Description"
            placeholder="Enter description"
            {...form.getInputProps("description")}
            withAsterisk
          />
          <Group mt="md">
            <Button type="submit">{editServiceId ? "Update" : "Save"}</Button>
          </Group>
        </form>
      </Modal>

      {services?.length === 0 ? (
        <NotFoundErrorSection title="There are no services you added" />
      ) : (
        <div className="overflow-y-scroll py-4">
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}

      <Button onClick={openAddServiceModal} mt={10}>
        Add Service
      </Button>
    </>
  );
};

export default Services;