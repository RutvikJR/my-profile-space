import { Button, Text, Box, Textarea, Modal, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MonthPickerInput } from '@mantine/dates';
import { useEffect, useState } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";

type Experience = Database['public']['Tables']['experience']['Row'];

const Experience = () => {
  const userId = userStore((store) => store.id);

  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [editExperienceId, setEditExperienceId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      position: '',
      company: '',
      start_date: null,
      end_date: null,
      description: '',
    },
    validate: {
      position: (value) => (value.length > 0 ? null : 'Job title is required'),
      company: (value) => (value.length > 0 ? null : 'Job location is required'),
      start_date: (value) => (value ? null : 'Start date is required'),
      end_date: (value) => (value ? null : 'End date is required'),
      description: (value) => (value.length > 0 ? null : 'Description is required'),
    },
  });

  useEffect(() => {
    if (userId) {
      loadExperiences();
    }
  }, [userId]);

  const loadExperiences = async () => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from('experience')
        .select()
        .eq('user_id', userId);

      if (error) {
        console.log(`Error fetching Experience : ${error}`);
      } else {
        setExperiences(data);
      }
      form.reset();
      setEditExperienceId(null);
    } catch (error) {
      console.log(`Error in Load Experience part : ${error}`)
    }
  };

  const handleAddExperience = async (values: { position: string; company: string; start_date: Date | null; end_date: Date | null; description: string }) => {
    if (!userId) return;
  
    try {
      const adjustedValues = {
        ...values,
        // Adjust the end date by adding one month to ensure it matches the user input
        start_date: values.start_date ? new Date(values.start_date.setMonth(values.start_date.getMonth() + 1)) : null,
        end_date: values.end_date ? new Date(values.end_date.setMonth(values.end_date.getMonth() + 1)) : null
      };
  
      const { data, error } = await supabaseClient
        .from('experience')
        .insert([{ ...adjustedValues, user_id: userId }])
        .select();
  
      if (error) {
        console.log(`Error adding experience : ${error}`);
      } else {
        setExperiences((prev) => (prev ? [...prev, data[0]] : [data[0]]));
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Add Experience part : ${error}`)
    }
  };
  
  const handleEditExperience = async (values: { position: string; company: string; start_date: Date | null; end_date: Date | null; description: string }) => {
    if (!userId || !editExperienceId) return;
  
    try {
      const adjustedValues = {
        ...values,
        // Adjust the end date by adding one month to ensure it matches the user input
        start_date: values.start_date ? new Date(values.start_date.setMonth(values.start_date.getMonth() + 1)) : null,
        end_date: values.end_date ? new Date(values.end_date.setMonth(values.end_date.getMonth() + 1)) : null
      };
  
      const { data, error } = await supabaseClient
        .from('experience')
        .update(adjustedValues)
        .eq('id', editExperienceId)
        .select();
  
      if (error) {
        console.log(`Error editing experience : ${error}`);
      } else {
        setExperiences((prev) => prev ? prev.map((exp) => (exp.id === data[0].id ? data[0] : exp)) : [data[0]]);
        setEditExperienceId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Edit Experience part : ${error}`)
    }
  };
  

  const handleDeleteExperience = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from('experience')
        .delete()
        .eq('id', id);

      if (error) {
        console.log(`Error deleting experience : ${error}`);
      } else {
        loadExperiences();
      }
    } catch (error) {
      console.log(`Error in Delete Experience part : ${error}`)
    }
  };

  const handleEditClick = (experience: Experience) => {
    form.setValues({
      position: experience.position,
      company: experience.company,
      start_date: experience.start_date ? new Date(experience.start_date) : null,
      end_date: experience.end_date ? new Date(experience.end_date) : null,
      description: experience.description
    });
    setEditExperienceId(experience.id.toString());
    setModalOpened(true);
  };

  const openAddExperienceModal = () => {
    form.reset();
    setEditExperienceId(null);
    setModalOpened(true);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  return (
    <>
      <Text size="xl" mb="md">Experience</Text>
      <Button onClick={openAddExperienceModal} color="cyan" mb="xl">
        Add Experience
      </Button>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editExperienceId ? 'Edit Experience' : 'Add Experience'}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (editExperienceId) {
              handleEditExperience(values);
            } else {
              handleAddExperience(values);
            }
          })}
        >
          <TextInput
            label="Job Title"
            placeholder="Job Title"
            {...form.getInputProps('position')}
            mb="md"
          />
          <TextInput
            label="Job Location/Company"
            placeholder="Job Location/Company"
            {...form.getInputProps('company')}
            mb="md"
          />
          <MonthPickerInput
            label="Start Date"
            placeholder="Pick start date"
            value={form.values.start_date}
            onChange={(date) => form.setFieldValue('start_date', date)}
            maxDate={new Date()}
            mb="md"
          />
          <MonthPickerInput
            label="End Date"
            placeholder="Pick end date"
            value={form.values.end_date}
            onChange={(date) => form.setFieldValue('end_date', date)}
            maxDate={new Date()}
            mb="md"
          />
          <Textarea
            label="Description"
            placeholder="Job Description"
            {...form.getInputProps('description')}
            mb="md"
          />
          <Button type="submit" color="cyan" mt="md">
            {editExperienceId ? 'Save Changes' : 'Add Experience'}
          </Button>
        </form>
      </Modal>

      {experiences?.length === 0 ? (
        <Text>There are no experiences you added</Text>
      ) : (
        <ul>
          {experiences?.map((experience) => (
            <li
              key={experience.id}
              className="rounded-lg shadow-md border border-black bg-cream p-4 mb-4"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-0">
                <div>
                  <div className="mr-4">
                    <strong>Job Title : </strong> {experience.position}
                  </div>
                  <div className="mr-4">
                    <strong>Job Location : </strong> {experience.company}
                  </div>
                  <div className="mr-4">
                    <strong>Start Date : </strong> {formatDate(experience.start_date)}
                  </div>
                  <div className="mr-4">
                    <strong>End Date : </strong> {formatDate(experience.end_date)}
                  </div>
                  <div>
                    <strong>Description : </strong> {experience.description}
                  </div>
                </div>
              </div>
              <div>
                <Button
                  onClick={() => handleEditClick(experience)}
                  className="mr-2 rounded-full"
                >
                  Edit
                </Button>
                <Button
                  color="red"
                  className="rounded-full"
                  onClick={() => handleDeleteExperience(experience.id.toString())}
                >
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Experience;
