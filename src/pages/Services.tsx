
import { Button, Text, TextInput, Box, Card, Textarea, Modal, Group } from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { useEffect, useState } from "react";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons from react-icons

type Service = Database["public"]["Tables"]["services"]["Row"];

const Services = () => {
  const userId = userStore((store) => store.id);

  
  const [editServiceId, setEditServiceId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const {services,setServices}=userStore();

  const form = useForm({
    initialValues: {
      name: "",
      description: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      description: (value) => (value.length > 0 ? null : "Description is required"),
    },
  });

  const loadServices = async () => {
    if (!userId) return;

    const { data, error } = await supabaseClient
      .from("services")
      .select()
      .eq("user_id", userId);

    if (error) {
      console.log("Error fetching services", error);
    } else {
      setServices(data);
    }
  };

  useEffect(() => {
    if (userId) {
      loadServices();
    }
  }, [userId]);

  const handleAddService = async (values: { name: string; description: string }) => {
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

  const handleEditService = async (values: { name: string; description: string }) => {
    if (!userId || !editServiceId) return;

    const { error } = await supabaseClient
      .from('services')
      .update({ name: values.name, description: values.description })
      .eq('id', editServiceId);

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
      .from('services')
      .delete()
      .eq('id', id);

    if (error) {
      console.log("Error deleting service", error);
    } else {
      loadServices();
    }
  };

  const handleEditClick = (service: Service) => {
    form.setValues({ name: service.name || '', description: service.description || '' });
    setEditServiceId(service.id.toString());
    setModalOpened(true);
  };

  const openAddServiceModal = () => {
    form.reset();
    setEditServiceId(null);
    setModalOpened(true);
  };

  const serviceCards = services?.map((service) => (
    <Card key={service.id} shadow="sm" padding="lg" style={{ marginBottom: '20px' }}>
      <Text fw={500}>{service.name}</Text>
      <Text size="sm">{service.description}</Text>
      <Group justify="right" mt="md">
        <FaEdit onClick={() => handleEditClick(service)} className="cursor-pointer text-blue-500" />
        <FaTrashAlt onClick={() => handleDeleteService(service.id.toString())} className="cursor-pointer text-red-500" />
      </Group>
    </Card>
  )) || [];
  
  return (
    <div>
      <Text>Services</Text>
      <Button onClick={openAddServiceModal} mb="md">Add Service</Button>
      {services == null || services.length === 0 ? (
        <Text>There are no services you added</Text>
      ) : (
        <div>{serviceCards}</div>
      )}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editServiceId ? 'Edit Service' : 'Add Service'}
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
              {...form.getInputProps('name')}
            />
            <Textarea
              label="Service Description"
              placeholder="Service Description"
              {...form.getInputProps('description')}
            />
            <Button type="submit" color="cyan" mt="md">
              {editServiceId ? 'Save' : 'Add'}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Services;
