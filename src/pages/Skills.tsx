import { Button, Text, TextInput, Rating, Box, Table } from "@mantine/core";
import { useForm } from "@mantine/form";
import userStore from "../store/userStore";
import { useEffect, useState } from "react";
import { supabaseClient } from "../config/supabaseConfig";
import { Database } from "../types/supabase";
import { FaEdit, FaTrashAlt } from 'react-icons/fa'; // Importing icons from react-icons

type Skill = Database['public']['Tables']['skills']['Row'];

const Skills = () => {
  const userId = userStore((store) => store.id);

  const [skills, setSkills] = useState<Skill[] | null>(null);
  const [editSkillId, setEditSkillId] = useState<string | null>(null);
  const [addOn,setAddOn]=useState(false);
  const [editOn,setEditOn]=useState(false);

  const form = useForm({
    initialValues: {
      name: '',
      rating: 0,
    },
    validate: {
      name: (value) => (value.length > 0 ? null : 'Name is required'),
      rating: (value) => (value > 0 ? null : 'Rating is required'),
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
    form.setValues({ name: skill.name || '', rating: skill.rating || 0 });
    setEditSkillId(skill.id.toString());
  };

  const rows = skills?.map((skill) => (
    <tr key={skill.id} className="text-center">
      <td className="px-4 truncate max-w-xs">{skill.name}</td>
      <td className="px-4 truncate max-w-xs">{skill.rating}</td>
      <td className="px-4">
        <FaEdit onClick={() => {handleEditClick(skill);
          setEditOn(true);
          setAddOn(false);
        }
        } className="cursor-pointer text-blue-500" />
      </td>
      <td className="px-4">
        <FaTrashAlt onClick={() => handleDeleteSkill(skill.id.toString())} className="cursor-pointer text-red-500" />
      </td>
    </tr>
  )) || [];

  const ths = (
    <tr className="text-center">
      <th className="px-4">Skill Name</th>
      <th className="px-4">Skill Rating</th>
      <th className="px-4"></th>
      <th className="px-4"></th>
    </tr>
  );

  return (
    <div>
      <Text>Skills</Text>
      {addOn||editOn?(<Box>
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
          />
          <Text>Rating</Text>
          <Rating
            value={form.values.rating}
            onChange={(value) => form.setFieldValue('rating', value || 0)}
          />
          <Button type="submit" color="cyan" mt="md" className="mb-4">
            {editSkillId&&editOn ? 'Save' : 'Add'}
          </Button>
          
        </form>
      </Box>):<></>}
      {addOn?<></>:<Button onClick={()=>{
        setAddOn(true);
        if(editOn)
          {
            setEditOn(false);
            form.reset();
          } 
      }}>Add skill</Button>}
      
      {skills == null || skills.length === 0 ? (
        <Text>There are no skills you added</Text>
      ) : (
        <Table striped highlightOnHover withTableBorder withColumnBorders>
          <thead>{ths}</thead>
          <tbody>{rows}</tbody>
        </Table>
      )}
    </div>
  );
};

export default Skills;
