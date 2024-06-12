import { Button, Text, TextInput, Box, Card, Textarea, Modal, Group, FileInput, Badge } from "@mantine/core";
import { MonthPickerInput } from '@mantine/dates';
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { useEffect, useState } from "react";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt, FaPlus, FaTimes } from 'react-icons/fa'; // Importing icons from react-icons

type Project = Database['public']['Tables']['projects']['Row'];

const Projects = () => {
  const userId = userStore((store) => store.id);

  const [projects, setProjects] = useState<Project[] | null>(null);
  const [editProjectId, setEditProjectId] = useState<number | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const form = useForm({
    initialValues: {
      title: '',
      description: '',
      client_name: '',
      industry: '',
      technology: [] as string[],
      date: new Date(), // Initialize with a valid Date object
      url: '',
      image: null as File | null,
    },
    validate: {
      title: (value) => (value.length > 0 ? null : 'Title is required'),
      description: (value) => (value.length > 0 ? null : 'Description is required'),
    },
  });

  const loadProjects = async () => {
    if (!userId) return;

    const { data, error } = await supabaseClient
      .from('projects')
      .select()
      .eq('user_id', userId);

    if (error) {
      console.log("Error fetching projects", error);
    } else {
      setProjects(data);
    }
  };

  useEffect(() => {
    if (userId) {
      loadProjects();
    }
  }, [userId]);

  const handleAddProject = async (values: typeof form.values) => {
    if (!userId) return;

    const { title, description, client_name, industry, technology, date, url } = values;

    const { error } = await supabaseClient
      .from('projects')
      .insert([{ 
        title, 
        description, 
        client_name, 
        industry, 
        technology, 
        date: (date instanceof Date) ? date.toISOString() : date, 
        url, 
        images: [], 
        user_id: userId 
      }]);

    if (error) {
      console.log("Error adding project", error);
    } else {
      form.reset();
      loadProjects();
      setModalOpened(false);
    }
  };

  const handleEditProject = async (values: typeof form.values) => {
    if (!userId || !editProjectId) return;

    const { title, description, client_name, industry, technology, date, url } = values;

    const { error } = await supabaseClient
      .from('projects')
      .update({
        title, 
        description, 
        client_name, 
        industry, 
        technology, 
        date: (date instanceof Date) ? date.toISOString() : date, 
        url, 
        images: [],
      })
      .eq('id', editProjectId);

    if (error) {
      console.log("Error updating project", error);
    } else {
      form.reset();
      setEditProjectId(null);
      loadProjects();
      setModalOpened(false);
    }
  };

  const handleDeleteProject = async (id: number) => {
    const { error } = await supabaseClient
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) {
      console.log("Error deleting project", error);
    } else {
      loadProjects();
    }
  };

  const handleEditClick = (project: Project) => {
    form.setValues({ 
      title: project.title || '', 
      description: project.description || '',
      client_name: project.client_name || '',
      industry: project.industry || '',
      technology: project.technology || [],
      date: project.date ? new Date(project.date) : new Date(), // Ensure date is a valid Date object
      url: project.url || '',
      image: null,
    });
    setEditProjectId(project.id);
    setModalOpened(true);
  };

  const openAddProjectModal = () => {
    form.reset();
    setEditProjectId(null);
    setModalOpened(true);
  };

  const handleAddTechnology = (technology: string) => {
    form.setFieldValue('technology', [...form.values.technology, technology]);
  };

  const handleRemoveTechnology = (index: number) => {
    form.setFieldValue('technology', form.values.technology.filter((_, i) => i !== index));
  };

  const projectCards = projects?.map((project) => (
    <Card key={project.id} shadow="sm" padding="lg" style={{ marginBottom: '20px' }}>
      <Text fw={500}>{project.title}</Text>
      <Text size="sm">{project.description}</Text>
      <Group justify="right" mt="md">
        <FaEdit onClick={() => handleEditClick(project)} className="cursor-pointer text-blue-500" />
        <FaTrashAlt onClick={() => handleDeleteProject(project.id)} className="cursor-pointer text-red-500" />
      </Group>
    </Card>
  )) || [];
  
  return (
    <div>
      <Text>Projects</Text>
      <Button onClick={openAddProjectModal} mb="md">Add Project</Button>
      {projects == null || projects.length === 0 ? (
        <Text>There are no projects you added</Text>
      ) : (
        <div>{projectCards}</div>
      )}
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editProjectId ? 'Edit Project' : 'Add Project'}
      >
        <Box>
          <form
            onSubmit={form.onSubmit((values) => {
              if (editProjectId) {
                handleEditProject(values);
              } else {
                handleAddProject(values);
              }
            })}
          >
            <TextInput
              label="Project Title"
              placeholder="Project Title"
              {...form.getInputProps('title')}
            />
            <Textarea
              label="Project Description"
              placeholder="Project Description"
              {...form.getInputProps('description')}
            />
            <TextInput
              label="Client Name"
              placeholder="Client Name"
              {...form.getInputProps('client_name')}
            />
            <TextInput
              label="Industry"
              placeholder="Industry"
              {...form.getInputProps('industry')}
            />
            <MonthPickerInput
              label="Date"
              placeholder="Pick start date"
              {...form.getInputProps('date')}
              maxDate={new Date()}
              mb="md"
            />
            <TextInput
              label="URL"
              placeholder="URL"
              {...form.getInputProps('url')}
            />
            <FileInput
              label="Project Image"
              placeholder="Upload image"
              onChange={(file) => form.setFieldValue('image', file)}
            />
            <div>
              <Text>Technologies</Text>
              {form.values.technology.map((tech, index) => (
                <Badge key={index} variant="filled" color="blue" rightSection={<FaTimes onClick={() => handleRemoveTechnology(index)} className="cursor-pointer" />}>
                  {tech}
                </Badge>
              ))}
              <Group mt="xs">
                <TextInput
                  placeholder="Add Technology"
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      event.preventDefault();
                      if (event.currentTarget.value.trim() !== '') {
                        handleAddTechnology(event.currentTarget.value);
                        event.currentTarget.value = '';
                      }
                    }
                  }}
                />
                <Button onClick={() => {
                  const input = document.querySelector('input[placeholder="Add Technology"]') as HTMLInputElement;
                  if (input?.value.trim() !== '') {
                    handleAddTechnology(input.value);
                    input.value = '';
                  }
                }}>
                  <FaPlus />
                </Button>
              </Group>
            </div>
            <Button type="submit" color="cyan" mt="md">
              {editProjectId ? 'Save' : 'Add'}
            </Button>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default Projects;
