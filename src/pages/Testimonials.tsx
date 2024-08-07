import { useState, useEffect } from "react";
import { Button, Text, Box, Textarea, Modal, TextInput, Select, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from "react-icons/fa";

type Testimonial = Database['public']['Tables']['testimonials']['Row'];

const Testimonials = () => {
  const userId = userStore((store) => store.id);

  const [testimonials, setTestimonials] = useState<Testimonial[] | null>(null);
  const [editTestimonialId, setEditTestimonialId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      position: '',
      review: '',
      is_male: null,
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      position: (value) => (value.length > 0 ? null : 'Position is required'),
      review: (value) => (value.length > 0 ? null : 'Review is required'),
      is_male: (value) => (value !== null ? null : 'Gender is required'),
    },
  });

  useEffect(() => {
    if (userId) {
      loadTestimonials();
    }
  }, [userId]);

  const loadTestimonials = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from('testimonials')
        .select()
        .eq('user_id', userId);

      if (error) {
        console.log(`Error fetching testimonials: ${error}`);
      } else {
        setTestimonials(data);
      }
      form.reset();
      setEditTestimonialId(null);
    } catch (error) {
      console.log(`Error in Load Testimonials part: ${error}`)
    }
  };

  const handleAddTestimonial = async (values: { name: string; position: string; review: string; is_male: boolean }) => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from('testimonials')
        .insert([{ ...values, user_id: userId }])
        .select();

      if (error) {
        console.log(`Error adding testimonial: ${error.message}`);
      } else {
        setTestimonials((prev) => (prev ? [...prev, data[0]] : [data[0]]));
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Add Testimonial part: ${error.message}`)
    }
  };

  const handleEditTestimonial = async (values: { name: string; position: string; review: string; is_male: boolean }) => {
    if (!userId || !editTestimonialId) return;

    try {
      const { data, error } = await supabaseClient
        .from('testimonials')
        .update(values)
        .eq('id', editTestimonialId)
        .select();

      if (error) {
        console.log(`Error editing testimonial: ${error}`);
      } else {
        setTestimonials((prev) => prev ? prev.map((test) => (test.id === data[0].id ? data[0] : test)) : [data[0]]);
        setEditTestimonialId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Edit Testimonial part: ${error}`)
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from('testimonials')
        .delete()
        .eq('id', id);

      if (error) {
        console.log(`Error deleting testimonial: ${error}`);
      } else {
        loadTestimonials();
      }
    } catch (error) {
      console.log(`Error in Delete Testimonial part: ${error}`)
    }
  };

  const handleEditClick = (testimonial: Testimonial) => {
    form.setValues({
      name: testimonial.name,
      position: testimonial.position,
      review: testimonial.review,
      is_male: testimonial.is_male,
    });
    setEditTestimonialId(testimonial.id.toString());
    setModalOpened(true);
  };

  const openAddTestimonialModal = () => {
    form.reset();
    setEditTestimonialId(null);
    setModalOpened(true);
  };
  const rows = testimonials?.map((testimonial) => (
    <Table.Tr key={testimonial.id} className="text-center">
      <Table.Td className="px-4 truncate max-w-xs">{testimonial.name}</Table.Td>
      <Table.Td className="px-4 truncate max-w-xs">{testimonial.position}</Table.Td>
      <Table.Td className="px-4 truncate max-w-xs">{testimonial.review}</Table.Td>
      <Table.Td className="px-4 truncate max-w-xs">{testimonial.is_male?<div>male</div>:<div>female</div>}</Table.Td>
      <Table.Td className="px-4">
        <div className="flex justify-end mx-3">
          <FaEdit onClick={() => handleEditClick(testimonial)} className="cursor-pointer text-blue-500 mx-3" />
          <FaTrashAlt onClick={() => handleDeleteTestimonial(testimonial.id.toString())} className="cursor-pointer text-red-500 mx-3" />
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
      <Text size="xl" mb="md">Testimonials</Text>
      <Button onClick={openAddTestimonialModal} color="cyan" mb="xl">
        Add Testimonial
      </Button>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editTestimonialId ? 'Edit Testimonial' : 'Add Testimonial'}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            // Convert string back to boolean before submission
            const formattedValues = { ...values, is_male: values.is_male === 'true' };
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
            {...form.getInputProps('name')}
            mb="md"
          />
          <TextInput
            label="Position"
            placeholder="Position"
            {...form.getInputProps('position')}
            mb="md"
          />
          <Textarea
            label="Review"
            placeholder="Review"
            {...form.getInputProps('review')}
            mb="md"
          />
          <Select
            label="Gender"
            placeholder={form.values.is_male ? 'Male' : 'Female'}
            
            data={[
              { value: 'true', label: 'Male' },
              { value: 'false', label: 'Female' },
            ]}
            {...form.getInputProps('is_male')}
            mb="md"
            value={form.values.is_male} 
          />
          <Button type="submit" color="cyan" mt="md">
            {editTestimonialId ? 'Save Changes' : 'Add Testimonial'}
          </Button>
        </form>
      </Modal>
  
      {testimonials?.length === 0 ? (
        <Text>There are no testimonials you added</Text>
      ) : (
        <div>
        
        <Table striped highlightOnHover withTableBorder>
        <Table.Thead>{ths}</Table.Thead>
        <Table.Tbody>{rows}</Table.Tbody>
      </Table>
      </div>
      )}
    </>
  );
  };
  

  export default Testimonials;

