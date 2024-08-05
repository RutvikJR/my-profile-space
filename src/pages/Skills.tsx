import { Button, Text, TextInput, Slider, Table, Modal } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useEffect, useState } from "react";
import { supabaseClient } from "../config/supabaseConfig";
import userStore from "../store/userStore";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons from react-icons

type Skill = Database['public']['Tables']['skills']['Row'];

const Skills = () => {
  const userId = userStore((store) => store.id);

  // const [skills, setSkills] = useState<Skill[] | null>(null);
  const [editSkillId, setEditSkillId] = useState<string | null>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const {skills,setSkills}=userStore();

  const form = useForm({
    initialValues: {
      name: '',
      rating: 1, // Default rating is now set to 1
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      rating: (value) => (value > 0 ? null : 'Rating is required more than 1'),
    },
  });

  const loadSkills = async () => {
    if (!userId) return;

    const { data, error } = await supabaseClient
      .from('skills')
      .select()
      .eq('user_id', userId);

    if (error) {
      console.log("Error fetching skills", error);
    } else {
      setSkills(data);
    }
  };

  useEffect(() => {
    if (userId) {
      loadSkills();
    }
  }, [userId]);

  const handleAddSkill = async (values: { name: string; rating: number }) => {
    if (!userId) return;

    const { error } = await supabaseClient
      .from('skills')
      .insert([{ ...values, user_id: userId }]);

    if (error) {
      console.log("Error adding skill", error);
    } else {
      form.reset();
      loadSkills();
      setModalOpened(false);
    }
  };

  const handleEditSkill = async (values: { name: string; rating: number }) => {
    if (!userId || !editSkillId) return;

    const { error } = await supabaseClient
      .from('skills')
      .update({ name: values.name, rating: values.rating })
      .eq('id', editSkillId);

    if (error) {
      console.log("Error updating skill", error);
    } else {
      form.reset();
      setEditSkillId(null);
      loadSkills();
      setModalOpened(false);
    }
  };

  const handleDeleteSkill = async (id: string) => {
    const { error } = await supabaseClient
      .from('skills')
      .delete()
      .eq('id', id);

    if (error) {
      console.log("Error deleting skill", error);
    } else {
      loadSkills();
    }
  };

  const handleEditClick = (skill: Skill) => {
    form.setValues({ name: skill.name || '', rating: skill.rating || 1 });
    setEditSkillId(skill.id.toString());
    setModalOpened(true);
  };

  const openAddSkillModal = () => {
    form.reset();
    setEditSkillId(null);
    setModalOpened(true);
  };

  const rows = skills?.map((skill) => (
    <Table.Tr key={skill.id} className="text-center">
      <Table.Td className="px-4 truncate max-w-xs">{skill.name}</Table.Td>
      <Table.Td className="px-4 truncate max-w-xs">{skill.rating}</Table.Td>
      <Table.Td className="px-4">
        <div className="flex justify-end mx-3">
          <FaEdit onClick={() => handleEditClick(skill)} className="cursor-pointer text-blue-500 mx-3" />
          <FaTrashAlt onClick={() => handleDeleteSkill(skill.id.toString())} className="cursor-pointer text-red-500 mx-3" />
        </div>
      </Table.Td>
    </Table.Tr>
  )) || [];

  const ths = (
    <Table.Tr className="text-center">
      <Table.Th className="px-4 text-center">Skill Name</Table.Th>
      <Table.Th className="px-4 text-center">Skill Rating</Table.Th>
      <Table.Th className="px-4 text-center"></Table.Th>
    </Table.Tr>
  );

  return (
    <div>
      <Text>Skills</Text>
      <Button onClick={openAddSkillModal} color="cyan" mb="xl">
        Add Skill
      </Button>
      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editSkillId ? 'Edit Skill' : 'Add Skill'}
      >
        <form
          onSubmit={form.onSubmit((values) => {
            if (editSkillId) {
              handleEditSkill(values);
            } else {
              handleAddSkill(values);
            }
          })}
        >
          <TextInput
            label="Skill Name"
            placeholder="Skill Name"
            {...form.getInputProps('name')}
            mb="md"
          />
          <Text>Rating</Text>
          <Slider
            value={form.values.rating}
            onChange={(value) => form.setFieldValue('rating', value)}
            min={1}
            max={10}
            marks={[
              { value: 1, label: '1' },
              { value: 2, label: '2' },
              { value: 3, label: '3' },
              { value: 4, label: '4' },
              { value: 5, label: '5' },
              { value: 6, label: '6' },
              { value: 7, label: '7' },
              { value: 8, label: '8' },
              { value: 9, label: '9' },
              { value: 10, label: '10' },
            ]}
            step={1}
            mb="md"
          />
          {form.errors.rating && <Text color="red">{form.errors.rating}</Text>}
          <Button type="submit" color="cyan" mt="md">
            {editSkillId ? 'Save Changes' : 'Add Skill'}
          </Button>
        </form>
      </Modal>

      {skills == null || skills.length === 0 ? (
        <Text>There are no skills you added</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder>
          <Table.Thead>{ths}</Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      )}
    </div>
  );
};

export default Skills;
