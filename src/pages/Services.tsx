import {
  Button,
  Text,
  TextInput,
  Box,
  Textarea,
  Modal,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { useState } from "react";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from "react-icons/fa"; // Importing icons from react-icons

type Service = Database["public"]["Tables"]["services"]["Row"];

const Services = () => {
  const userId = userStore((store) => store.id);

  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const { services, loadServices } = userStore();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      description: (value) =>
        value.length > 0 ? null : "Description is required",
    },
  });

  const handleAddService = async (values: {
    name: string;
    description: string;
  }) => {
    if (!userId) return;

    const { error } = await supabaseClient
      .from("services")
      .insert([{ ...values, user_id: userId }]);

    if (error) {
      console.log("Error adding service", error);
    } else {
      form.reset();
      loadServices();
      setModalOpened(false);
    }
  };

  const handleEditService = async (values: {
    name: string;
    description: string;
  }) => {
    if (!userId || !editServiceId) return;

    const { error } = await supabaseClient
      .from("services")
      .update({ name: values.name, description: values.description })
      .eq("id", editServiceId);

    if (error) {
      console.log("Error updating service", error);
    } else {
      form.reset();
      setEditServiceId(null);
      loadServices();
      setModalOpened(false);
    }
  };

  const handleDeleteService = async (id: string) => {
    const { error } = await supabaseClient
      .from("services")
      .delete()
      .eq("id", id);

    if (error) {
      console.log("Error deleting service", error);
    } else {
      loadServices();
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

  const openAddServiceModal = () => {
    form.reset();
    setEditServiceId(null);
    setModalOpened(true);
  };

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Service Name</Table.Th>
      <Table.Th className="px-4 text-center">Service Description</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );
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
  return (
    <div>
      <Text>Services</Text>
      <Button onClick={openAddServiceModal} mb="md">
        Add Service
      </Button>
      {services == null || services.length === 0 ? (
        <Text>There are no services you added</Text>
      ) : (
        <div>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editServiceId ? "Edit Service" : "Add Service"}
      >
        <Box>
          <form
            onSubmit={form.onSubmit((values) => {
              if (editServiceId) {
                handleEditService(values);
              } else {
                handleAddService(values);
              }
            })}
          >
            <TextInput
              label="Service Name"
              placeholder="Service Name"
              {...form.getInputProps("name")}
            />
            <Textarea
              label="Service Description"
              placeholder="Service Description"
              {...form.getInputProps("description")}
            />
            <Button type="submit" color="cyan" mt="md">
              {editServiceId ? "Save" : "Add"}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Services;
