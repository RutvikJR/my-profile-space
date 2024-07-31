import { Button, Text, Modal, TextInput, Checkbox, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import { MonthPickerInput } from '@mantine/dates';
import { useEffect, useState } from "react";
import userStore from "../store/userStore";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";

type Experience = Database['public']['Tables']['experience']['Row'];

const Experience = () => {
  const userId = userStore((store) => store.id);

  // const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [editExperienceId, setEditExperienceId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const {experience,setExperience}=userStore();

  const form = useForm({
    initialValues: {
      position: '',
      company: '',
      start_date: null as Date | null,
      end_date: null as Date | null,
      description: '',
      is_present: true,
    },
    validate: {
      position: (value) => (value.length > 0 ? null : 'Job title is required'),
      company: (value) => (value.length > 0 ? null : 'Job location is required'),
      start_date: (value, values) => {
        if (!value) {
          return 'Start date is required';
        }
        if (!values.is_present && values.end_date && new Date(value) > new Date(values.end_date)) {
          return 'Start date must be before end date';
        }
        return null;
      },
      end_date: (value, values) => {
        if (!values.is_present) {
          if (!value) {
            return 'End date is required';
          }
          if (values.start_date && new Date(value) < new Date(values.start_date)) {
            return 'End date must be after start date';
          }
        }
        return null;
      },
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
        console.log(`Error fetching Experience: ${error.message}`);
      } else {
        setExperience(data);
      }
      form.reset();
      setEditExperienceId(null);
    } catch (error) {
      console.log(`Error in Load Experience part: ${error}`);
    }
  };

  const handleAddExperience = async (values: typeof form.values) => {
    if (!userId) return;

    try {
      const adjustedValues = {
        ...values,
        start_date: values.start_date ? new Date(values.start_date.setMonth(values.start_date.getMonth() + 1)) : null,
        end_date: values.is_present ? null : (values.end_date ? new Date(values.end_date.setMonth(values.end_date.getMonth() + 1)) : null),
      };

      const { data, error } = await supabaseClient
        .from('experience')
        .insert([{ ...adjustedValues, user_id: userId }])
        .select();

      if (error) {
        console.log(`Error adding experience: ${error.message}`);
      } else {
        setExperience((prev) => (prev ? [...prev, data[0]] : [data[0]]));
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Add Experience part: ${error}`);
    }
  };

  const handleEditExperience = async (values: typeof form.values) => {
    if (!userId || !editExperienceId) return;

    try {
      const { data: currentData, error: fetchError } = await supabaseClient
        .from('experience')
        .select('start_date, end_date')
        .eq('id', editExperienceId)
        .single();

      if (fetchError) {
        console.log(`Error fetching current experience data: ${fetchError.message}`);
        return;
      }

      const adjustedValues: any = {
        position: values.position,
        company: values.company,
        description: values.description,
        is_present: values.is_present,
      };

      if (values.start_date !== null && new Date(values.start_date).toISOString() !== new Date(currentData.start_date).toISOString()) {
        adjustedValues.start_date = new Date(values.start_date);
        adjustedValues.start_date.setMonth(adjustedValues.start_date.getMonth() + 1);
      }

      if (!values.is_present && values.end_date !== null && new Date(values.end_date).toISOString() !== new Date(currentData.end_date).toISOString()) {
        adjustedValues.end_date = new Date(values.end_date);
        adjustedValues.end_date.setMonth(adjustedValues.end_date.getMonth() + 1);
      } else if (values.is_present) {
        adjustedValues.end_date = null;
      }

      const { data, error } = await supabaseClient
        .from('experience')
        .update(adjustedValues)
        .eq('id', editExperienceId)
        .select();

      if (error) {
        console.log(`Error editing experience: ${error.message}`);
      } else {
        setExperience((prev) => prev ? prev.map((exp) => (exp.id === data[0].id ? data[0] : exp)) : [data[0]]);
        setEditExperienceId(null);
        form.reset();
        setModalOpened(false);
      }
    } catch (error) {
      console.log(`Error in Edit Experience part: ${error}`);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    try {
      const { error } = await supabaseClient
        .from('experience')
        .delete()
        .eq('id', id);

      if (error) {
        console.log(`Error deleting experience: ${error.message}`);
      } else {
        loadExperiences();
      }
    } catch (error) {
      console.log(`Error in Delete Experience part: ${error}`);
    }
  };

  const handleEditClick = (experience: Experience) => {
    form.setValues({
      position: experience.position,
      company: experience.company,
      start_date: experience.start_date ? new Date(experience.start_date) : null,
      end_date: experience.end_date ? new Date(experience.end_date) : null,
      description: experience.description,
      is_present: experience.end_date === null,
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
            error={form.errors.start_date}
          />
          <Checkbox
            label="I am currently working in this role"
            checked={form.values.is_present}
            onChange={(event) => form.setFieldValue('is_present', event.currentTarget.checked)}
            mb="md"
          />
          <MonthPickerInput
            label="End Date"
            placeholder="Pick end date"
            value={form.values.end_date}
            onChange={(date) => form.setFieldValue('end_date', date)}
            minDate={form.values.start_date || undefined}
            maxDate={new Date()}
            mb="md"
            error={form.errors.end_date}
            disabled={form.values.is_present}
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

      {experience?.length === 0 ? (
        <Text>There are no experiences you added</Text>
      ) : (
        <ul>
          {experience?.map((experience) => (
            <li
              key={experience.id}
              className="rounded-lg shadow-md border border-black bg-cream p-4 mb-4"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-2 md:mb-0">
                <div>
                  <div className="mr-4">
                    <strong>Job Title: </strong> {experience.position}
                  </div>
                  <div className="mr-4">
                    <strong>Job Location: </strong> {experience.company}
                  </div>
                  <div className="mr-4">
                    <strong>Start Date: </strong> {formatDate(experience.start_date)}
                  </div>
                  <div className="mr-4">
                    <strong>End Date: </strong> {experience.end_date ? formatDate(experience.end_date) : 'Present'}
                  </div>
                  <div>
                    <strong>Description: </strong> {experience.description}
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
