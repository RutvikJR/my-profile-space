import { Button, Text, TextInput, Box, Textarea } from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { useEffect, useState } from "react";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";

type Experience = Database['public']['Tables']['experience']['Row'];

const Experience = () => {
  const userId = userStore((store) => store.id);

  const [experiences, setExperiences] = useState<Experience[] | null>(null);
  const [editExperienceId, setEditExperienceId] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      position: '',
      company: '',
      start_date: '',
      end_date: '',
      description: '',
    },
    validate: {
      position: (value) => (value.length > 0 ? null : 'Job title is required'),
      company: (value) => (value.length > 0 ? null : 'Job location is required'),
      start_date: (value) => (value.length > 0 ? null : 'Start year is required'),
      end_date: (value) => (value.length > 0 ? null : 'End year is required'),
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
    } catch (error) {
      console.log(`Error in Load Experience part : ${error}`)
    }
  };

  const handleAddExperience = async (values: { position: string; company: string; start_date: string; end_date: string; description: string }) => {
    if (!userId) return;

    try {
      const { data, error } = await supabaseClient
        .from('experience')
        .insert([{ ...values, user_id: userId }])
        .select();
  
      if (error) {
        console.log(`Error adding experience : ${error}`);
      } else {
        setExperiences((prev) => (prev ? [...prev, data[0]] : [data[0]]));
        form.reset();
      }
    } catch (error) {
      console.log(`Error in Add Experience part : ${error}`)
    }
  };

  const handleEditExperience = async (values: { position: string; company: string; start_date: string; end_date: string; description: string }) => {
    if (!userId || !editExperienceId) return;
try {
  
      const { data, error } = await supabaseClient
        .from('experience')
        .update(values)
        .eq('id', editExperienceId)
        .select();
  
      if (error) {
        console.log(`Error editing experience : ${error}`);
      } else {
        setExperiences((prev) => prev ? prev.map((exp) => (exp.id === data[0].id ? data[0] : exp)) : [data[0]]);
        setEditExperienceId(null);
        form.reset();
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
      start_date: experience.start_date,
      end_date: experience.end_date,
      description: experience.description
    });
    setEditExperienceId(experience.id.toString());
  };

  return (
    <>
      <Text size="xl" weight={700} mb="md">Experience</Text>
      <Box mb="xl">
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
          <TextInput
            label="Start Year"
            placeholder="Start Year"
            {...form.getInputProps('start_date')}
            mb="md"
          />
          <TextInput
            label="End Year"
            placeholder="End Year"
            {...form.getInputProps('end_date')}
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
      </Box>

      {experiences?.length === 0 ? (
        <Text>There are no experiences you added</Text>
      ) : (
        <ul>
          {experiences?.map((experience) => (
            <li key={experience.id} style={{ marginBottom: '1rem' }} className="flex">
              <div><strong>Job Title : </strong> {experience.position}</div>
              <div><strong>Job Location : </strong> {experience.company}</div>
              <div><strong>Start Year : </strong> {experience.start_date}</div>
              <div><strong>End Year : </strong> {experience.end_date}</div>
              <div><strong>Description : </strong> {experience.description}</div>
              <Button onClick={() => handleEditClick(experience)} className="mr-2 ml-2 rounded-full">Edit</Button>
              <Button color="red" className="mr-2 ml-2 rounded-full" onClick={() => handleDeleteExperience(experience.id.toString())}>
                Delete
              </Button>
            </li>
          ))}
        </ul>
      )}
    </>
  );
};

export default Experience;
