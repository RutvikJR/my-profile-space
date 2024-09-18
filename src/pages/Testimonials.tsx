import { useState } from "react";
import {
  Button,
  Text,
  Textarea,
  Modal,
  TextInput,
  Select,
  Table,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { showToast } from "../utils/toast";
import PageTitle from "../components/PageTitle";
import NotFoundErrorSection from "../components/NotFoundErrorSection";

type Testimonial = Database["public"]["Tables"]["testimonials"]["Row"];

const Testimonials = () => {
  const userId = userStore((store) => store.id);

  const { testimonials, loadTestimonials } = userStore();

  const [editTestimonialId, setEditTestimonialId] = useState<string | null>(
    null
  );
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: "",
      position: "",
      review: "",
      is_male: "",
    },
    validate: {
      name: (value) => (value.length > 0 ? null : "Name is required"),
      position: (value) => (value.length > 0 ? null : "Position is required"),
      review: (value) => (value.length > 0 ? null : "Review is required"),
      is_male: (value) => (value !== null ? null : "Gender is required"),
    },
  });

  const handleAddTestimonial = async (values: {
    name: string;
    position: string;
    review: string;
    is_male: boolean;
  }) => {
    if (!userId) return;

    try {
      const { error } = await supabaseClient
        .from("testimonials")
        .insert([{ ...values, user_id: userId }])
        .select();

      if (error) {
        showToast("Failed to add Testimonial record, please try again!","error");
        console.log(`Error adding testimonial: ${error.message}`);
      } else {
        showToast("Testimonial record added successfully!","success");
        loadTestimonials();
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast("Failed to add Testimonial record, please try again!","error");
      if (error instanceof Error) {
        console.error(error.message);
      } else {
        console.error(
          "An unexpected error occurred while adding a testimonial:",
          error
        );
      }
    }
  };

  const handleEditTestimonial = async (values: {
    name: string;
    position: string;
    review: string;
    is_male: boolean;
  }) => {
    if (!userId || !editTestimonialId) return;

    try {
      const { error } = await supabaseClient
        .from("testimonials")
        .update(values)
        .eq("id", editTestimonialId)
        .select();

      if (error) {
        showToast("Failed to update Testimonial record, please tey again!", "error");
        console.log(`Error editing testimonial: ${error}`);
      } else {
        showToast("Testimonial record updated successfully!", "updated");
        loadTestimonials();
        setEditTestimonialId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      showToast("Failed to update Testimonial record, please tey again!", "error");
      console.log(`Error in Edit Testimonial part: ${error}`);
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from("testimonials")
        .delete()
        .eq("id", id);

      if (error) {
        showToast("Failed to delete Testimonial record, please try again!","error");
        console.log(`Error deleting testimonial: ${error}`);
      } else {
        showToast("Testimonial record deleted successfully!", "deleted");
        loadTestimonials();
      }
    } catch (error) {
      showToast("Failed to delete Testimonial record, please try again!", "error");
      console.log(`Error in Delete Testimonial part: ${error}`);
    }
  };

  const handleEditClick = (testimonial: Testimonial) => {
    form.setValues({
      name: testimonial.name,
      position: testimonial.position,
      review: testimonial.review,
      is_male: testimonial.is_male === true ? "true" : "false",
    });
    setEditTestimonialId(testimonial.id.toString());
    setModalOpened(true);
  };

  const openAddTestimonialModal = () => {
    form.reset();
    setEditTestimonialId(null);
    setModalOpened(true);
  };
  const rows =
    testimonials?.map((testimonial) => (
      <Table.Tr key={testimonial.id} className="text-center">
        <Table.Td className="px-4 truncate max-w-xs">
          {testimonial.name}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {testimonial.position}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {testimonial.review}
        </Table.Td>
        <Table.Td className="px-4 truncate max-w-xs">
          {testimonial.is_male ? <div>male</div> : <div>female</div>}
        </Table.Td>
        <Table.Td className="px-4">
          <div className="flex justify-end mx-3">
            <FaEdit
              onClick={() => handleEditClick(testimonial)}
              className="cursor-pointer text-blue-500 mx-3"
            />
            <FaTrashAlt
              onClick={() => handleDeleteTestimonial(testimonial.id.toString())}
              className="cursor-pointer text-red-500 mx-3"
            />
          </div>
        </Table.Td>
      </Table.Tr>
    )) || [];

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Name</Table.Th>
      <Table.Th className="px-4 text-center">position</Table.Th>
      <Table.Th className="px-4 text-center">Review</Table.Th>
      <Table.Th className="px-4 text-center">Gender</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );
  return (
    <>
     <PageTitle title="Testimonials" />
      
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editTestimonialId ? "Edit Testimonial" : "Add Testimonial"}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            // Convert string back to boolean before submission
            const formattedValues = {
              ...values,
              is_male: values.is_male === "true",
            };
            if (editTestimonialId) {
              handleEditTestimonial(formattedValues);
            } else {
              handleAddTestimonial(formattedValues);
            }
          })}
        >
          <TextInput
            label="Name"
            placeholder="Name"
            {...form.getInputProps("name")}
            mb="md"
          />
          <TextInput
            label="Position"
            placeholder="Position"
            {...form.getInputProps("position")}
            mb="md"
          />
          <Textarea
            label="Review"
            placeholder="Review"
            {...form.getInputProps("review")}
            mb="md"
          />
          <Select
            label="Gender"
            placeholder={form.values.is_male ? "Male" : "Female"}
            data={[
              { value: "true", label: "Male" },
              { value: "false", label: "Female" },
            ]}
            {...form.getInputProps("is_male")}
            mb="md"
            value={form.values.is_male}
          />
          <Button type="submit" mt={10}>
            {editTestimonialId ? "Save Changes" : "Add Testimonial"}
          </Button>
        </form>
      </Modal>

      {testimonials?.length === 0 ? (
        <NotFoundErrorSection title="There are no testimonials you added" />
      
      ) : (
        <div>
          <Table striped highlightOnHover withTableBorder>
            <Table.Thead>{ths}</Table.Thead>
            <Table.Tbody>{rows}</Table.Tbody>
          </Table>
        </div>
      )}

<Button onClick={openAddTestimonialModal} mt={10}>
        Add Testimonial
      </Button>
    </>
  );
};

export default Testimonials;
